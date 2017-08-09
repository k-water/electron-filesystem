export function render () {
  var canvas = document.querySelector('#J_loginBackground')
  if (!canvas) {
    return
  }
  var ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.lineWidth = 0.3
  ctx.strokeStyle = (new Color(150)).style

  var i, j, iDot, jDot

  var mousePosition = {
    x: 30 * canvas.width / 100,
    y: 30 * canvas.height / 100
  }

  var dots = {
    nb: 750,
    distance: 50,
    d_radius: 100,
    array: []
  }

  function colorValue (min) {
    return Math.floor(Math.random() * 255 + min)
  }

  function createColorStyle (r, g, b) {
    return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)'
  }

  function mixComponents (comp1, weight1, comp2, weight2) {
    return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2)
  }

  function averageColorStyles (dot1, dot2) {
    var color1 = dot1.color
    var color2 = dot2.color

    var r = mixComponents(color1.r, dot1.radius, color2.r, dot2.radius)
    var g = mixComponents(color1.g, dot1.radius, color2.g, dot2.radius)
    var b = mixComponents(color1.b, dot1.radius, color2.b, dot2.radius)
    return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b))
  }

  function Color (min) {
    min = min || 0
    this.r = colorValue(min)
    this.g = colorValue(min)
    this.b = colorValue(min)
    this.style = createColorStyle(this.r, this.g, this.b)
  }

  function Dot () {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height

    this.vx = -0.5 + Math.random()
    this.vy = -0.5 + Math.random()

    this.radius = Math.random() * 2

    this.color = new Color()
    // console.log(this)
  }

  Dot.prototype = {
    draw: function () {
      ctx.beginPath()
      ctx.fillStyle = this.color.style
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      ctx.fill()
    }
  }

  function createDots () {
    for (i = 0; i < dots.nb; i++) {
      dots.array.push(new Dot())
    }
  }

  function moveDots () {
    for (i = 0; i < dots.nb; i++) {
      var dot = dots.array[i]

      if (dot.y < 0 || dot.y > canvas.height) {
        dot.vx = dot.vx
        dot.vy = -dot.vy
      } else if (dot.x < 0 || dot.x > canvas.width) {
        dot.vx = -dot.vx
        dot.vy = dot.vy
      }
      dot.x += dot.vx
      dot.y += dot.vy
    }
  }

  function connectDots () {
    for (i = 0; i < dots.nb; i++) {
      for (j = 0; j < dots.nb; j++) {
        iDot = dots.array[i]
        jDot = dots.array[j]

        if ((iDot.x - jDot.x) < dots.distance && (iDot.y - jDot.y) < dots.distance && (iDot.x - jDot.x) > -dots.distance && (iDot.y - jDot.y) > -dots.distance) {
          if ((iDot.x - mousePosition.x) < dots.d_radius && (iDot.y - mousePosition.y) < dots.d_radius && (iDot.x - mousePosition.x) > -dots.d_radius && (iDot.y - mousePosition.y) > -dots.d_radius) {
            ctx.beginPath()
            ctx.strokeStyle = averageColorStyles(iDot, jDot)
            ctx.moveTo(iDot.x, iDot.y)
            ctx.lineTo(jDot.x, jDot.y)
            ctx.stroke()
            ctx.closePath()
          }
        }
      }
    }
  }

  function drawDots () {
    for (i = 0; i < dots.nb; i++) {
      var dot = dots.array[i]
      dot.draw()
    }
  }

  function animateDots () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    moveDots()
    connectDots()
    drawDots()

    requestAnimationFrame(animateDots)
  }

  canvas.onmousemove = function (e) {
    mousePosition.x = e.pageX
    mousePosition.y = e.pageY
  }

  canvas.onmouseleave = function (e) {
    mousePosition.x = canvas.width / 2
    mousePosition.y = canvas.height / 2
  }

  createDots()
  requestAnimationFrame(animateDots)
}
