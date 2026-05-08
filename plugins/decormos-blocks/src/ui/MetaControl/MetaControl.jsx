import { SelectControl, ComboboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import apiFetch from '@wordpress/api-fetch';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { META_TYPES } from '../../constants/wordpress';
import { buildRestEndpoint } from '../../utils/buildRestEndpoint';
import { extractMetaKeysFromOptionsResponse } from '../../utils/extractMetaKeysFromOptionsResponse';

const MetaControl = ( { value = {}, onChange, filterMetaKey = null } ) => {
  const {
    metaType = 'post',
    entity = '',
    metaKey = '',
  } = value;

  const [ metaKeyOptions, setMetaKeyOptions ] = useState([]);
  const [ isLoadingMetaKeys, setIsLoadingMetaKeys ] = useState(false);
  const [loadedPath, setLoadedPath] = useState('');

  const { postTypes = [], taxonomies = [], isResolving } = useSelect( (select) => {
    const core = select( coreStore );

    const postTypeRecords = core.getPostTypes?.( { per_page: -1, context: 'edit' } ) || [];
    const taxonomyRecords = core.getTaxonomies?.( { per_page: -1, context: 'edit' } ) || [];
  
    return {
      postTypes: postTypeRecords,
      taxonomies: taxonomyRecords,
      isResolving:
        core.isResolving('getPostTypes', [{ per_page: -1, context: 'edit' }]) ||
        core.isResolving('getTaxonomies', [{ per_page: -1, context: 'edit' }]),
    }
  }, [] );

  const postTypeOptions = useMemo(() => {
    return postTypes
      .filter((t) => t?.viewable !== false && t?.slug && t?.rest_base)
      .map((t) => ({ label: t.name || t.slug, value: t.slug }));
  }, [postTypes]);
  const taxonomyOptions = useMemo(() => {
    return taxonomies
      .filter((t) => t?.slug && t?.rest_base)
      .map((t) => ({ label: t.name || t.slug, value: t.slug }));
  }, [taxonomies]);

  const collectionPath = useMemo(() => {
    if (metaType === 'post') {
      const pt = postTypes.find((item) => item?.slug === entity);
      return buildRestEndpoint(pt?.rest_namespace, pt?.rest_base);
    }

    if (metaType === 'term') {
      const tx = taxonomies.find((item) => item?.slug === entity);
      return buildRestEndpoint(tx?.rest_namespace, tx?.rest_base);
    }
    if (metaType === 'user') return '/wp/v2/users';
    if (metaType === 'comment') return '/wp/v2/comments';
    return '';
  },  [metaType, entity, postTypes, taxonomies ]);

  useEffect(() => {
    if (!collectionPath) {
      setMetaKeyOptions([]);
      setIsLoadingMetaKeys(false);
      setLoadedPath('');
      return;
    }

    let mounted = true;
    setIsLoadingMetaKeys(true);

    apiFetch({ path: collectionPath, method: 'OPTIONS' })
      .then((response) => {
        if (!mounted) return;
        const allMetaKeys = extractMetaKeysFromOptionsResponse(response);
        const nextMetaKeys =
          typeof filterMetaKey === 'function'
            ? allMetaKeys.filter((item) => filterMetaKey(item))
            : allMetaKeys;

        setMetaKeyOptions(nextMetaKeys);
        setLoadedPath(collectionPath);
      })
      .catch(() => {
        if (!mounted) return;
        setMetaKeyOptions([]);
        setLoadedPath(collectionPath);
      })
      .finally(() => {
        if (mounted) setIsLoadingMetaKeys(false);
      });

      return () => {
        mounted = false;
      };
  }, [ collectionPath, filterMetaKey ]);

  useEffect(() => {
    if (!metaKey || !isLoadingMetaKeys || loadedPath !== collectionPath) {
      return;
    }

    const hasCurrentKey = metaKeyOptions.some((item) => item.value === metaKey);

    if (!hasCurrentKey) {
      onChange({ ...value, metaKey: '' });
    }
  }, [metaKey, metaKeyOptions, loadedPath, isLoadingMetaKeys, onChange, value]);

  const isEntityRequired = metaType === 'post' || metaType === 'term';
  const entitySelectLabel = 
    metaType === 'post' ? __('Тип записи', 'decormos-blocks') :
    metaType === 'term' ? __('Таксономия', 'decormos-blocks') :
    null;

  const entityOptions = useMemo(() => {
    return metaType === 'post' ? postTypeOptions :
      metaType === 'term' ? taxonomyOptions :
      [];
  }, [metaType, postTypeOptions, taxonomyOptions]);

  useEffect(() => {
    if (!isEntityRequired) {
      return;
    }

    if (entity) {
      return;
    }

    if (!entityOptions.length) {
      return;
    }

    onChange({
      ...value,
      entity: entityOptions[0].value,
    });
  }, [isEntityRequired, entity, entityOptions, onChange, value]);
  
  return (
    <>
      <SelectControl
        label={ __( 'Тип источника', 'decormos-blocks' ) }
        options={ META_TYPES }
        value={ metaType }
        onChange={ (metaType) => onChange({ ...value, metaType, entity: '', metaKey: '' }) }
      />
      {isEntityRequired && (
        <SelectControl
          label={ entitySelectLabel }
          options={ 
            entityOptions.length > 0 ? 
              entityOptions : 
              [ 
                { 
                  label: isResolving ? 'Загрузка…' : 'Нет данных', 
                  value: '' 
                } 
              ] 
            }
          value={ entity }
          onChange={ (entity) => onChange({ ...value, entity, metaKey: '' }) }
        />
      )}
      <ComboboxControl
        label={ __('Выберите ключ', 'decormos-blocks') }
        className='decormos-meta-control-combobox'
        placeholder={ __('Выберите ключ', 'decormos-blocks' )}
        value={ metaKey }
        onChange={ (metaKey ) => onChange({ ...value, metaKey })}
        disabled={ isLoadingMetaKeys || !collectionPath }
        options={
          metaKeyOptions.length
            ? metaKeyOptions
            : [{ label: isLoadingMetaKeys ? 'Загрузка…' : 'Ключи не найдены', value: '' }]
        }
      />
    </>
  );
}

export default MetaControl;
