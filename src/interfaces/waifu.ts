import { Franchise } from './franchise'
import { WaifuType } from './waifu_type'
import { WaifuImage } from './waifu_image'

export interface Waifu {
  id: number
  franchiseId: number
  typeId: number
  userId?: number
  name: string
  nickname?: string
  age: number
  createdAt: Date
  updatedAt: Date
  franchise?: Franchise
  waifuType?: WaifuType
  waifuImages: WaifuImage[]
}

export interface WaifuList {
  id: number
  publicId: string
  publicUrl: string
  waifuId: number
  waifu: Waifu
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWaifu (json: string): Waifu {
    return cast(JSON.parse(json), r('Waifu'))
  }

  public static waifuToJson (value: Waifu): string {
    return JSON.stringify(uncast(value, r('Waifu')), null, 2)
  }
}

function invalidValue (typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ)
  const parentText = parent ? ` on ${parent}` : ''
  const keyText = key ? ` for key '${key}'` : ''
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
      val
    )}`
  )
}

function prettyTypeName (typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`
    } else {
      return `one of [${typ
        .map((a: any) => {
          return prettyTypeName(a)
        })
        .join(', ')}]`
    }
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal
  } else {
    return typeof typ
  }
}

function jsonToJSProps (typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }))
    typ.jsonToJS = map
  }
  return typ.jsonToJS
}

function jsToJSONProps (typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {}
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }))
    typ.jsToJSON = map
  }
  return typ.jsToJSON
}

function transform (
  val: any,
  typ: any,
  getProps: any,
  key: any = '',
  parent: any = ''
): any {
  function transformPrimitive (typ: string, val: any): any {
    if (typeof typ === typeof val) return val
    return invalidValue(typ, val, key, parent)
  }

  function transformUnion (typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length
    for (let i = 0; i < l; i++) {
      const typ = typs[i]
      try {
        return transform(val, typ, getProps)
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent)
  }

  function transformEnum (cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val
    return invalidValue(
      cases.map((a: string) => {
        return l(a)
      }),
      val,
      key,
      parent
    )
  }

  function transformArray (typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent)
    return val.map((el:any) => transform(el, typ, getProps))
  }

  function transformDate (val: any): any {
    if (val === null) {
      return null
    }
    const d = new Date(val)
    if (isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent)
    }
    return d
  }

  function transformObject (
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent)
    }
    const result: any = {}
    Object.getOwnPropertyNames(props).forEach((key: string) => {
      const prop = props[key]
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined
      result[prop.key] = transform(v, prop.typ, getProps, key, ref)
    })
    Object.getOwnPropertyNames(val).forEach((key: string) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref)
      }
    })
    return result
  }

  if (typ === 'any') return val
  if (typ === null) {
    if (val === null) return val
    return invalidValue(typ, val, key, parent)
  }
  if (typ === false) return invalidValue(typ, val, key, parent)
  let ref: any
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref
    typ = typeMap[typ.ref]
  }
  if (Array.isArray(typ)) return transformEnum(typ, val)
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty('props')
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent)
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val)
  return transformPrimitive(typ, val)
}

function cast<T> (val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps)
}

function uncast<T> (val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps)
}

function l (typ: any) {
  return { literal: typ }
}

function a (typ: any) {
  return { arrayItems: typ }
}

function u (...typs: any[]) {
  return { unionMembers: typs }
}

function o (props: any[], additional: any) {
  return { props, additional }
}

function r (name: string) {
  return { ref: name }
}

const typeMap: any = {
  Waifu: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'franchiseId', js: 'franchiseId', typ: 0 },
      { json: 'typeId', js: 'typeId', typ: 0 },
      { json: 'userId', js: 'userId', typ: null },
      { json: 'name', js: 'name', typ: '' },
      { json: 'nickname', js: 'nickname', typ: null },
      { json: 'age', js: 'age', typ: 0 },
      { json: 'createdAt', js: 'createdAt', typ: Date },
      { json: 'updatedAt', js: 'updatedAt', typ: Date },
      { json: 'franchise', js: 'franchise', typ: r('Franchise') },
      { json: 'waifuType', js: 'waifuType', typ: r('WaifuType') },
      { json: 'waifuImages', js: 'waifuImages', typ: a(r('WaifuImage')) },
    ],
    false
  ),
  Franchise: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'nickname', js: 'nickname', typ: null },
      { json: 'image', js: 'image', typ: null },
      { json: 'webPage', js: 'webPage', typ: null },
      { json: 'userId', js: 'userId', typ: null },
      { json: 'createdAt', js: 'createdAt', typ: Date },
      { json: 'updatedAt', js: 'updatedAt', typ: Date },
    ],
    false
  ),
  WaifuImage: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'waifuId', js: 'waifuId', typ: 0 },
      { json: 'rarityId', js: 'rarityId', typ: 0 },
      { json: 'userId', js: 'userId', typ: null },
      { json: 'imageTypeId', js: 'imageTypeId', typ: 0 },
      { json: 'points', js: 'points', typ: 0 },
      { json: 'publicId', js: 'publicId', typ: '' },
      { json: 'publicUrl', js: 'publicUrl', typ: '' },
      { json: 'createdAt', js: 'createdAt', typ: Date },
      { json: 'updatedAt', js: 'updatedAt', typ: Date },
      { json: 'waifuRarity', js: 'waifuRarity', typ: r('WaifuRarity') },
      { json: 'imageType', js: 'imageType', typ: r('ImageType') },
    ],
    false
  ),
  ImageType: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'icon', js: 'icon', typ: u(null, '') },
      { json: 'initialDate', js: 'initialDate', typ: null },
      { json: 'finalDate', js: 'finalDate', typ: null },
      { json: 'createdAt', js: 'createdAt', typ: Date },
      { json: 'updatedAt', js: 'updatedAt', typ: Date },
    ],
    false
  ),
  WaifuRarity: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'icon', js: 'icon', typ: '' },
      { json: 'cost', js: 'cost', typ: 0 },
      { json: 'createdAt', js: 'createdAt', typ: Date },
      { json: 'updatedAt', js: 'updatedAt', typ: Date },
    ],
    false
  ),
  WaifuType: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'createdAt', js: 'createdAt', typ: Date },
      { json: 'updatedAt', js: 'updatedAt', typ: Date },
    ],
    false
  ),
}
