"use strict";
module.exports = (function(global){
function isf(f){ return typeof f === "function" }
function isp(p){ return p instanceof PM }
function bind(p, s){ return function(v){ done(p, s, v) } }
function PM(fn){
	if(!isp(this)){ return new PM(fn) }
	this.$status = 0;
	if(isf(fn)){
		var p = this;
		setTimeout(function(){
			try{ fn(bind(p, 1), bind(p, -1)) }
			catch(e){ $reject(p, rea) }
		}, 0);
	}
}

function run(fn, d, sta, val){
	setTimeout(function(){
		if(isf(fn)){
			try{
				var $val = fn(val);
				if($val === d.promise){ throw TypeError("Promise Cyclic") }
				else if(isp($val)){
					chain($val, d.resolve, d.reject)
				}
				else{
					d.resolve($val)
				}
			}
			catch(e){
				d.reject(e)
			}
		}
		else if(sta === 1){ d.resolve(val) }
		else if(sta === -1){ d.reject(val) }
	}, 0);
}

function queue(q, sta, val){
	while(q && q.length){
		run(q.shift(), q.shift(), sta, val);
	}
}

function done(p, sta, val){
	if(p.$status === 0){
		queue(p[sta > 0 ? "$squeue" : "$jqueue"], sta, val);
		p.$status = sta;
		p.$value = val;
	}
	while(p.$squeue && p.$squeue.length){ p.$squeue.pop() }
	while(p.$jqueue && p.$jqueue.length){ p.$jqueue.pop() }
	p.$squeue = p.$jqueue = undefined;
	delete p.$squeue;
	delete p.$jqueue
	return p;
}

function Defer(){
	var p = new PM;
	return {
		promise: p,
		resolve: bind(p, 1),
		reject: bind(p, -1)
	}
}

function chain(p, sfn, jfn){
	var d = PM.defer();
	switch(p.$status){
		case 0:
			p.$squeue = p.$squeue || [];
			p.$squeue.push(sfn, d);
			p.$jqueue = p.$jqueue || [];
			p.$jqueue.push(jfn, d);
		break;
		case 1: run(sfn, d, 1, p.$value); break;
		case -1:
			run(jfn, d, -1, p.$value);
		break;
	}
	return d.promise;
}

function convert(val){
	if(!isp(val) && val !== null && val !== undefined && typeof val !== "boolean" && typeof val !== "string" && typeof val !== "number"){
		var then;
		try{ then = val.then }
		catch(e){ return PM.reject(e) }
		if(isf(then)){
			var d = PM.defer();
			try{ then.call(val, d.resolve, d.reject) }
			catch(e){ d.reject(e) }
			return d.promise;
		}
	}
	return val;
}

PM.prototype.then = function(sfn, jfn){
	var p = this;
	return chain(p, function(val){
		val = convert(val, p);
		if(val === p){
			return jfn(TypeError("Promise Cyclic"))
		}
		else if(isp(val)){
			return val.then(sfn, jfn);
		}
		else{
			return isf(sfn) ? sfn(val) : val;
		}
	}, jfn);
};
PM.prototype.catch = function(jfn){ return this.then(null, jfn) };

PM.resolve = function(val){ return done(new PM, 1, val) };
PM.reject = function(rea){ return done(new PM, -1, rea) };
PM.defer = function(){ return Defer() };
return PM;
})(this);
