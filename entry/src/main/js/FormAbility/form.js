import formBindingData from '@ohos.app.form.formBindingData';
import formInfo from '@ohos.app.form.formInfo';

export default {
    onCreate(want) {
        console.info('Form onCreate');
        let formData = {};
        return formBindingData.createFormBindingData(formData);
    },

    onCastToNormal(formId) {
        console.info('Form onCastToNormal');
    },

    onUpdate(formId) {
        console.info('Form onUpdate');
    },

    onVisibilityChange(newStatus) {
        console.info('Form onVisibilityChange');
    },

    onEvent(formId, message) {
        console.info('Form onEvent');
    },

    onDestroy(formId) {
        console.info('Form onDestroy');
    },

    onAcquireFormState(want) {
        return formInfo.FormState.READY;
    }
}