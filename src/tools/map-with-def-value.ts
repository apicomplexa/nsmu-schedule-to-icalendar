export class MapWithDefaultValue<Index, Value> extends Map<Index, Value> {
  defaultValue: Value
  constructor(
    iterable: Iterable<readonly [Index, Value]>,
    defaultValue: Value
  ) {
    super(iterable)
    this.defaultValue = defaultValue
  }
  get(key: Index): Value {
    return super.get(key) ?? this.defaultValue
  }
}
