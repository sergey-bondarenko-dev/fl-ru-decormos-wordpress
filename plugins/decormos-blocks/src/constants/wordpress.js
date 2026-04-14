import { __ } from '@wordpress/i18n';

export const META_TYPES = [
  {
    label: __('Запись', 'decormos-blocks'),
    value: 'post',
  },
  {
    label: __('Термин', 'decormos-blocks'),
    value: 'term',
  },
  {
    label: __('Пользователь', 'decormos-blocks'),
    value: 'user',
  },
  {
    label: __('Комментарий', 'decormos-blocks'),
    value: 'comment',
  },
];
