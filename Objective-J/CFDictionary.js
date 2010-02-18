
function CFDictionary(/*CFDictionary*/ aDictionary)
{
    this._keys = [];
    this._count = 0;
    this._buckets = { };
    this._UID = generateObjectUID();
}

var indexOf = Array.prototype.indexOf,
    hasOwnProperty = Object.prototype.hasOwnProperty;

CFDictionary.prototype.copy = function()
{
    // Immutable, so no need to actually copy.
    return this;
}

CFDictionary.prototype.mutableCopy = function()
{
    var newDictionary = new CFMutableDictionary(),
        keys = this._keys,
        count = this._count;

    newDictionary._keys = keys.slice();
    newDictionary._count = count;

    var index = 0,
        buckets = this._buckets,
        newBuckets = newDictionary._buckets;

    for (; index < count; ++index)
    {
        var key = keys[index];

        newBuckets[key] = buckets[key];
    }

    return newDictionary;
}

CFDictionary.prototype.containsKey = function(/*String*/ aKey)
{
    return hasOwnProperty.apply(this._buckets, [aKey]);
}

CFDictionary.prototype.containsValue = function(/*id*/ anObject)
{
    var keys = this._keys,
        buckets = this._buckets,
        index = 0,
        count = keys.length;

    for (; index < count; ++index)
        if (buckets[keys] === anObject)
            return YES;

    return NO;
}

CFDictionary.prototype.count = function()
{
    return this._count;
}

CFDictionary.prototype.countOfKey = function(/*String*/ aKey)
{
    return this.containsKey(aKey) ? 1 : 0;
}

CFDictionary.prototype.countOfValue = function(/*id*/ anObject)
{
    var keys = this._keys,
        buckets = this._buckets,
        index = 0,
        count = keys.length,
        countOfValue = 0;

    for (; index < count; ++index)
        if (buckets[keys] === anObject)
            return ++countOfValue;

    return countOfValue;
}

CFDictionary.prototype.keys = function()
{
    return this._keys.slice();
}

CFDictionary.prototype.valueForKey = function(/*String*/ aKey)
{
    var buckets = this._buckets;

    if (!hasOwnProperty.apply(buckets, [aKey]))
        return nil;

    return buckets[aKey];
}

CFDictionary.prototype.toString = function()
{
    var string = "{\n",
        keys = this._keys,
        index = 0,
        count = this._count;

    for (; index < count; ++index)
    {
        var key = keys[index];

        string += "\t" + key + " = \"" + String(this.valueForKey(key)).split('\n').join("\n\t") + "\"\n";
    }

    return string + "}";
}

CFMutableDictionary = function(/*CFDictionary*/ aDictionary)
{
    CFDictionary.apply(this, []);
}

CFMutableDictionary.prototype = new CFDictionary();

CFMutableDictionary.prototype.copy = function()
{
    return this.mutableCopy();
}

CFMutableDictionary.prototype.addValueForKey = function(/*String*/ aKey, /*Object*/ aValue)
{
    if (this.containsKey(aKey))
        return;

    ++this._count;

    this._keys.push(aKey);
    this._buckets[aKey] = aValue;
}

CFMutableDictionary.prototype.removeValueForKey = function(/*String*/ aKey)
{
    var indexOfKey = -1;

    if (indexOf)
        indexOfKey = indexOf.call(this._keys, aKey);
    else
    {
        var keys = this._keys,
            index = 0,
            count = keys.length;
        
        for (; index < count; ++index)
            if (keys[index] === aKey)
            {
                indexOfKey = index;
                break;
            }
    }

    if (indexOfKey === -1)
        return;

    --this._count;

    this._keys.splice(indexOfKey, 1);
    delete this._buckets[aKey];
}

CFMutableDictionary.prototype.removeAllValues = function()
{
    this._count = 0;
    this._keys = [];
    this._buckets = { };
}

CFMutableDictionary.prototype.replaceValueForKey = function(/*String*/ aKey, /*Object*/ aValue)
{
    if (!this.containsKey(aKey))
        return;

    this._buckets[aKey] = aValue;
}

CFMutableDictionary.prototype.setValueForKey = function(/*String*/ aKey, /*Object*/ aValue)
{
    if (aValue === nil || aValue === undefined)
        this.removeValueForKey(aKey);

    else if (this.containsKey(aKey))
        this.replaceValueForKey(aKey, aValue);

    else
        this.addValueForKey(aKey, aValue);
}

// Exports

exports.CFDictionary = CFDictionary;
exports.CFMutableDictionary = CFMutableDictionary;
