export const extractMetaKeysFromOptionsResponse = (response) => {
  const schema =
    response?.schema ||
    response?.endpoints?.find((endpoint) => endpoint?.schema)?.schema;

  const metaProps = schema?.properties?.meta?.properties;
  if (!metaProps || typeof metaProps !== 'object') return [];

  return Object.entries(metaProps).map(([key, property]) => ({
    value: key,
    label: property?.title || key,
    type: property?.type || '',
    description: property?.description || '',
    itemsType: property?.items?.type || '',
    rawSchema: property,
  }));
}
