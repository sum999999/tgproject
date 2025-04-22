window.fireworksDraw = false;

function fireworks(t, dom) {
	var e = document.querySelector(dom || "body"),
		n = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (t) {
			window.setTimeout(t, 1e3 / 60)
		},
		i = {
			particleCount: 50,
			angle: 90,
			spread: 100,
			startVelocity: 25,
			decay: .9,
			ticks: 150,
			zIndex: 100,
			colors: ["#5BC0EB", "#2176AE", "#FDE74C", "#9BC53D", "#E55934", "#FA7921", "#FF4242"]
		},
		o = void 0;

	function a(t) {
		return parseInt(t, 16)
	}

	function s(t, e, n) {
		return function (t, e) {
			return e ? e(t) : t
		}(t && function (t) {
			return !(null === t || void 0 === t)
		}(t[e]) ? t[e] : i[e], n)
	}

	function c(t) {
		var e = t.getContext("2d"),
			n = window.devicePixelRatio || 1,
			r = e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1,
			i = n / r;
		t.width = document.documentElement.clientWidth * i,
			t.height = document.documentElement.clientHeight * i,
			t.style.width = document.documentElement.clientWidth + "px",
			t.style.height = document.documentElement.clientHeight + "px"
	}

	function l(t) {
		var e = t.angle * (Math.PI / 180),
			n = t.spread * (Math.PI / 180);
		return {
			x: t.x,
			y: t.y,
			depth: .5 * Math.random() + .6,
			wobble: 10 * Math.random(),
			velocity: .5 * t.startVelocity + Math.random() * t.startVelocity,
			angle2D: -e + (.5 * n - Math.random() * n),
			tiltAngle: Math.random() * Math.PI,
			color: function (t) {
				var e = (t + "").replace(/[^0-9a-f]/gi, "");
				return e.length < 6 && (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]), {
					r: a(e.substring(0, 2)),
					g: a(e.substring(2, 4)),
					b: a(e.substring(4, 6))
				}
			}(t.color),
			tick: 0,
			totalTicks: t.ticks,
			decay: t.decay,
			random: Math.random() + 5,
			tiltSin: 0,
			tiltCos: 0,
			wobbleX: 0,
			wobbleY: 0
		}
	}

	function p(t, e, i) {
		function o() {
			l = p = null
		}
		var a = e.slice(),
			s = t.getContext("2d"),
			l = parseInt(t.style.width, 10),
			p = parseInt(t.style.height, 10);
		s.save(),
			s.scale(t.width / l, t.height / p);
		var d = new Promise((e) => {
			n(function r() {
				l || p || (c(t),
						l = parseInt(t.style.width, 10),
						p = parseInt(t.style.height, 10),
						s.restore(),
						s.scale(t.width / l, t.height / p)),
					s.clearRect(0, 0, l, p),
					a = a.filter(function (t) {
						return function (t, e) {
							e.x += Math.cos(e.angle2D) * e.velocity,
								e.y += Math.sin(e.angle2D) * e.velocity + 5 * e.depth,
								e.wobble += .1,
								e.velocity *= e.decay,
								e.tiltAngle += .02 * Math.random() + .12,
								e.tiltSin = Math.sin(e.tiltAngle),
								e.tiltCos = Math.cos(e.tiltAngle),
								e.random = Math.random() + 4,
								e.wobbleX = e.x + 10 * Math.cos(e.wobble) * e.depth,
								e.wobbleY = e.y + 10 * Math.sin(e.wobble) * e.depth;
							var n = e.tick++/ e.totalTicks,
							r = e.x + e.random * e.tiltCos,
								i = e.y + e.random * e.tiltSin,
								o = e.wobbleX + e.random * e.tiltCos,
								a = e.wobbleY + e.random * e.tiltSin;
							return t.fillStyle = "rgba(" + e.color.r + ", " + e.color.g + ", " + e.color.b + ", " + (1 - n) + ")",
								t.beginPath(),
								e.depth,
								t.moveTo(Math.floor(e.x), Math.floor(e.y)),
								t.lineTo(Math.floor(e.wobbleX), Math.floor(i)),
								t.lineTo(Math.floor(o), Math.floor(a)),
								t.lineTo(Math.floor(r), Math.floor(e.wobbleY)),
								t.closePath(),
								t.fill(),
								e.tick < e.totalTicks
						}(s, t)
					}),
					a.length ? n(r) : (window.removeEventListener("resize", o),
						i(),
						e())
			})
		})

		return window.addEventListener("resize", o, !1), {
			addFettis: function (t) {
				return a = a.concat(t),
					d
			},
			canvas: t,
			promise: d
		}
	}
	if (fireworksDraw) {
		return
	}
	window.fireworksDraw = true;
	e && function (t, e) {
		let id = 'fireCanvas';
		for (var n = s(e, "particleCount", Math.floor), r = s(e, "angle", Number), i = s(e, "spread", Number), a = s(e, "startVelocity", Number), d = s(e, "decay", Number), f = s(e, "colors"), u = s(e, "ticks", Number), m = s(e, "zIndex", Number), g = function (t) {
				var e = s(t, "origin", Object);
				return e.x = s(e, "x", Number),
					e.y = s(e, "y", Number),
					e
			}(e), h = n, b = [], v = o ? o.canvas : function (t) {

				var e = document.querySelector('#' + id);
				if (e) {
					e.update = true
				} else {
					e = document.createElement("canvas");
					e.id = id;
				}

				//  var e = document.createElement("canvas");

				return c(e),
					e.style.position = "fixed",
					e.style.top = "0px",
					e.style.left = "0px",
					e.style.pointerEvents = "none",
					e.style.zIndex = t,
					e
			}(m), x = g.x, y = g.y; h--;)
			b.push(l({
				x: x,
				y: y,
				angle: r,
				spread: i,
				startVelocity: a,
				color: f[h % f.length],
				ticks: u,
				decay: d
			}));
		o ? o.addFettis(b) : (!v.update && t.appendChild(v),
			(o = p(v, b, function () {
				o = null;
				dom = document.querySelector('#' + id);
				if (dom) {
					t.removeChild(dom)
				}
				fireworksDraw = false;
				//  t.removeChild(v)
			})).promise)
	}(e, {
		particleCount: 150,
		startVelocity: 45,
		origin: t
	})
}

export default fireworks