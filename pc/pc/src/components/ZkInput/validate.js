'use strict'

import {
	isEmpty,
	isNotEmpty
} from './utils.js'
import context from "@/main";

function validate_fields() {
	const objs = validate_fields.fields
	for (const i in objs) {
		this[i] = objs[i]
	}
	validate_fields.fields = this
	return this
}

validate_fields.fields = { /**/ }

validate_fields.set = function (key, val) {
	if (key in validate_fields.fields) {
		throw new Error("field has been defined")
	}
	validate_fields.fields[key] = val
}

validate_fields.get = function (key, _default) {
	if (key in validate_fields.fields) {
		return validate_fields.fields[key] || _default
	}
	return _default
}

validate_fields.destory = function () {
	validate_fields.fields = {}
}

var defaultStrategies = {
	maxlength(value, length, errmsg = context.$tex('超过最大长度限制')) {
		value = isEmpty(value) ? '' : value
		if (`${value}`.length > +length) {
			return errmsg
		}
	},
	minlength(value, length, errmsg = context.$tex('低于最低长度限制')) {
		value = isEmpty(value) ? '' : value
		if (`${value}`.length < +length) {
			return errmsg
		}
	},
	digitilen(value, length, errmsg = context.$tex('小数部分长度超过限制')) {
		value = isEmpty(value) ? '' : value
		const params = `${value}`.split('.')
		const intval = params[0]
		const digitival = params[1]
		if (isNotEmpty(digitival) && digitival.length > +length) {
			return errmsg
		}
	},
	max(value, maxvalue, errmsg = context.$tex('超过最大值限制')) {
		value = isEmpty(value) ? 0 : value
		if (+value > +maxvalue) {
			return errmsg
		}
	},
	min(value, minvalue, errmsg = context.$tex('低于最小值限制')) {
		value = isEmpty(value) ? 0 : value;
		if (+value < +minvalue) {
			return errmsg
		}
	},
	nonzero(value, errmsg = context.$tex('数字第一位不能为0')) {
		var regx = /^(\-)?0\d$/
		if (regx.test(value)) {
			return errmsg
		}
	},
	digit(value, errmsg = context.$tex('必须为数字')) {
		var regx = /^(\-)?\d*(\.?\d*)?$/;
		const v = `${value}`.split('.')[0]

		if (!regx.test(value)) {
			return errmsg
		}
	},
	number(value, errmsg = context.$tex('必须为整数')) {
		var regx = /^(\-)?\d*?$/;
		if (!regx.test(value)) {
			return errmsg
		}
	},
	require(value, errmsg = context.$tex('必填')) {
		if (isEmpty(value)) {
			return errmsg
		}
	},
}

function Validate() {
	if (this instanceof Validate) {
		validate_fields.destory()
		validate_fields.call(this)
		this.init()
		return this
	}
	return new Validate()
}

Validate.prototype = {
	constructor: Validate.prototype.constructor,
	init() {
		validate_fields.set('strategies', {})
		validate_fields.set('validators', {})
		this.importStrategies(defaultStrategies)
	}
}

Validate.prototype.validate = function (rule, value, errMsg) {
	const ruleElements = rule.split(":");
	const strategy = ruleElements.shift();
	const params = ruleElements;
	params.unshift(value);
	params.push(errMsg);
	return this.strategies[strategy].apply(this, params);
};

Validate.prototype.addValidator = function () {
	const params = Array.prototype.slice.call(arguments, 0)
	this.validators.push(() => {
		return this.validate.apply(this, params)
	});
};

Validate.prototype.addValidationStrategy = function (name, strategy) {
	this.strategies[name] = strategy;
};

Validate.prototype.importStrategies = function (strategies) {
	for (var strategyName in strategies) {
		this.addValidationStrategy(strategyName, strategies[strategyName]);
	}
};

Validate.prototype.check = function () {
	for (var i = 0, validator; validator = this.validators[i++];) {
		var errmsg = validator();
		if (errmsg) {
			return errmsg;
		}
	}
};

export default Validate
