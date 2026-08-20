/*
 * Barrel de la capa local del Design System.
 *
 * Cuando el proyecto tenga acceso al registry privado, este archivo es el único
 * punto que hay que cambiar:
 *
 *   export {
 *     ThemeProvider, Button as DlButton, Chip as DlChip, TextArea as DlTextArea,
 *     TextInput as DlTextInput, Select as DlSelect, Overlay as DlOverlay,
 *     SheetGeneric as DlSheetGeneric, SheetGrade as DlSheetGrade,
 *     SegmentControl as DlSegmentControl, Tag as DlTag,
 *   } from '@credifranco/design-system-vue/beta/components'
 */

export { getIllustration } from './illustrations'

export { default as ThemeProvider } from './components/ThemeProvider.vue'
export { default as DlBrand } from './components/DlBrand.vue'
export { default as DlButton } from './components/DlButton.vue'
export { default as DlChip } from './components/DlChip.vue'
export { default as DlIcon } from './components/DlIcon.vue'
export { default as DlIllustration } from './components/DlIllustration.vue'
export { default as DlOverlay } from './components/DlOverlay.vue'
export { default as DlSegmentControl } from './components/DlSegmentControl.vue'
export { default as DlSelect } from './components/DlSelect.vue'
export { default as DlSheetGeneric } from './components/DlSheetGeneric.vue'
export { default as DlSheetGrade } from './components/DlSheetGrade.vue'
export { default as DlTag } from './components/DlTag.vue'
export { default as DlTextArea } from './components/DlTextArea.vue'
export { default as DlTextInput } from './components/DlTextInput.vue'
