<template>

  <b-card
    border-variant="light">

    <b-card-header
      border-variant="light">

      <b-button
        size="sm"
        @click="$router.go(-1)">

        Back

      </b-button>

    </b-card-header>

    <b-card-body>

      <b-form
        @submit.stop.prevent="onSubmit"
        novalidate>

        <b-form-group
          id="term-group"
          label="Term"
          label-for="term"
          :invalid-feedback="$formHelper.invalidFeedback(
            $v.entry.term, 'Term')">

          <b-form-input
            id="term"
            name="term"
            type="text"
            placeholder="Enter term..."
            :value="$v.entry.term.$model"
            :state="validateState($v.entry.term, 'term')"
            @input="updateEntryTerm">

          </b-form-input>

          <b-form-invalid-feedback
            :state="!(apiError.response.errorList['term'] !== undefined)">

            <div
              v-for="(msg, index) in apiError.response.errorList.name"
              :key="index">

              {{ msg }}

            </div>

          </b-form-invalid-feedback>

        </b-form-group>

        <br>

        <b-form-group
          id="definition-group"
          label="Defintion"
          label-for="definition"
          :invalid-feedback="$formHelper.invalidFeedback(
          $v.entry.definition, 'Defintion')"
          :state="validateState($v.entry.definition, 'definition')">

          <quill-editor
            ref="infoQuillEditor"
            :class="fieldStyle($v.entry.definition)"
            :value="$v.entry.definition.$model"
            @focus="onEditorFocus()"
            @blur="onEditorBlur()"
            @change="onEditorChange()"/>

        </b-form-group>

        <br>

        <b-form-group
          id="category-group"
          label="Select Category"
          label-for="category"
          :invalid-feedback="$formHelper.invalidFeedback(
            $v.entry.category, 'Category')">

          <b-form-select
            id="category"
            name="category"
            :value="$v.entry.category.$model"
            :options="categoryOptions"
            :state="validateState($v.entry.category, 'category')"
            @input="updateEntryCategory"
          ></b-form-select>

        </b-form-group>

        <br>

        <b-form-group
          id="publish-group">

            <b-form-checkbox
              id="published"
              :checked="entry.published"
              value="1"
              name="published"
              unchecked-value="0"
              @change="updateEntryPublished">

              Publish info item to category

            </b-form-checkbox>

        </b-form-group>

        <br>

        <b-button
          type="submit"
          variant="primary">

          Create Info Item

        </b-button>

        <b-button
          class="ml-2"
          @click="resetForm()">

          Reset

        </b-button>

      </b-form>

    </b-card-body>

  </b-card>

</template>

<script>

import { required, minLength } from 'vuelidate/lib/validators';
import { mapActions, mapGetters } from 'vuex';

function minTextLength(param) {
  return function() {
    return (this.quillContentTextLength > param);
  };
}

export default {
  data() {
    return {
      focused: false,
      user: this.$store.state.auth.user,
      categoryOptions: [],
      quillContentTextLength: null,
    };
  },
  computed: {
    ...mapGetters('InfosSingle', ['entry', 'lists', 'apiError', 'loading']),

    editor() {
      return this.$refs.infoQuillEditor.quill;
    }
  },
  validations: {
    entry: {
      term: {
        required,
        minLength: minLength(2)
      },
      definition: {
        required,
        //minLength: minLength(9),
        minQuillContentLength: minTextLength(5)
      },
      category: {
        required,
      },
      selectedTeams: {
        required,
      }
    }
  },
  beforeDestroy() {
    this.resetState();
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.setListsCategories().then(() => {
          this.categoryOptions = this.$formHelper.generateFormSelectOptionsList(
            this.lists.categories, 'Select a role for this new member...');
        });

        this.initialiseInfoForm();
      }
    }
  },
  methods: {
    ...mapActions('InfosSingle', [
      'setEntryTerm',
      'setEntryDefinition',
      'setEntryCategory',
      'setEntryPublished',
      'setListsCategories',
      'fetchEditData',
      'updateData',
      'resetState'
    ]),
    initialiseInfoForm() {
      this.fetchEditData(this.$route.params.id).then(() => {

        this.quillContentTextLength = this.editor.getLength();

        this.$v.entry.$touch();
      });
    },
    onEditorFocus() {
      this.focused = true;
    },
    onEditorBlur() {
      this.focused = false;
    },
    onEditorChange() {
      this.quillContentTextLength =
        this.editor.getLength();

      this.updateEntryDefinition(this.editor.root.innerHTML);
    },
    validateState(item, name = '') {
      const { $dirty, $error } = item;

      return $dirty ? !($error ||
        (this.apiError.response.errorList[name] !== undefined)) : null;
    },
    updateEntryTerm(e) {
      this.$v.entry.term.$touch();
      this.setEntryTerm(e);
    },
    updateEntryDefinition(e) {
      this.$v.entry.definition.$touch();
      this.setEntryDefinition(e);
    },
    updateEntryCategory(e) {
      this.$v.entry.category.$touch();
      this.setEntryCategory(e);
    },
    updateEntryPublished(e) {
      this.setEntryPublished(e);
    },
    /* CBW - Note: this method required for dynmic class bindings for
                   styling of wysiwyg editor during client side validation */
    fieldStyle(validation) {
      if (this.focused) {
        return {
          'form-control': true,
          'is-valid': validation.$dirty && !validation.$error,
          'is-invalid': validation.$error,
          'isInvalidFocus': validation.$error,
          'isValidFocus': validation.$dirty && !validation.$error,
        };
      } else {
        return {
          'form-control': true,
          'is-valid': validation.$dirty && !validation.$error,
          'is-invalid': validation.$error,
        };
      }
    },
    onSubmit() {
      this.$v.form.$touch();

      if (this.$v.form.$anyError) {
        return;
      }

      this.storeData().then(() => {
        this.$router.push({ name: 'categories.show',
          params: { id: this.$route.params.categoryId } });

      });
    },
    resetForm() {
      this.initialiseInfoForm();
    }
  }
};

</script>
