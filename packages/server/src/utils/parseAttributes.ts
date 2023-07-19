import getCuid from 'cuid';

export default function parseAttributes(projectId: string, groupId: string, data: any, name: string = 'root', parentId?: string): Attribute[] {
  const cuid = getCuid();
  const attributes: Attribute[] = [];
  const attributeBase = {id: cuid, projectId, groupId, parentId, name, required: true, ignore: false, description: null};

  function getObjectChildren(object: object) {
    return Array.from(Object.keys(object))
      .map(key => parseAttributes(projectId, groupId, object[key], key, cuid))
      .flat();
  }

  // Identify Array
  if (Array.isArray(data) && name) {
    if (data.length === 0) {
      attributes.push({...attributeBase, type: 'error', description: 'Empty array was detected'});
      return attributes;
    }

    if (typeof data[0] === 'string') {
      attributes.push({...attributeBase, type: 'array_of_strings'});
      return attributes;
    }

    if (typeof data[0] === 'number') {
      attributes.push({...attributeBase, type: 'array_of_numbers'});
      return attributes;
    }

    if (typeof data[0] === 'object') {
      const attribute: Attribute = {...attributeBase, type: 'array_of_objects'};
      const childrenAttributes = getObjectChildren(data[0]);
      attributes.push(...[attribute, ...childrenAttributes]);
      return attributes;
    }
  }

  // Identify Object
  if (typeof data === 'object') {
    const attribute: Attribute = {...attributeBase, type: 'object' as AttributeTypeEnum};
    const childrenAttributes = getObjectChildren(data);
    attributes.push(...[attribute, ...childrenAttributes]);
    return attributes;
  }

  if (typeof data === 'string') {
    attributes.push({...attributeBase, type: 'string'});
    return attributes;
  }

  if (typeof data === 'number') {
    attributes.push({...attributeBase, type: 'number'});
    return attributes;
  }

  attributes.push({...attributeBase, type: 'error', description: `Unsupported type: ${typeof data}`});
  return attributes;
}
