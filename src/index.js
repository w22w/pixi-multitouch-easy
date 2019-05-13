export default function multitouch(sprite, config = {}) {
  
  function start(e) {
    sprite.on('touchmove', move);
  }
  
  function move(e) {
    let t = e.data.originalEvent.targetTouches;
    if (!t || t.length < 2) {
      return;
    }
    let dx = t[ 0 ].clientX - t[ 1 ].clientX;
    let dy = t[ 0 ].clientY - t[ 1 ].clientY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx);
    if (!sprite._pinch) {
      sprite._pinch = {
        startAngle: angle,
        p: {
          touches: t.map(function (touch) {
            return {
              x: touch.clientX,
              y: touch.clientY
            };
          }),
          distance: distance,
          date: new Date()
        }
      };
      sprite.emit('pinchstart');
      return;
    }
    let now = new Date();
    let interval = now - sprite._pinch.p.date;
    if (interval < 12) {
      return;
    }
    let center = {
      x: (t[ 0 ].clientX + t[ 1 ].clientX) / 2,
      y: (t[ 0 ].clientY + t[ 1 ].clientY) / 2
    };
    
    let touchAngle = Math.atan2(dy, dx);
    let angleChange = touchAngle - sprite._pinch.startAngle;
    const rotation = sprite._pinch.startAngle + (angleChange * 180 / Math.PI );
    
    let event = {
      scale: distance / sprite._pinch.p.distance,
      velocity: distance / interval,
      center: center,
      data: e.data,
      rotation: rotation
    }
    sprite.emit('multitouchmove', event)
    sprite._pinch.pp = {
      distance: sprite._pinch.p.distance,
      touches: sprite._pinch.p.touches,
      date: sprite._pinch.p.date
    }
    sprite._pinch.p = {
      distance: distance,
      touches: t.map(function (touch) {
        return {
          x: touch.clientX,
          y: touch.clientY
        }
      }),
      date: now
    }
  }
  
  function end(e) {
    sprite.removeListener('touchmove', move);
    if (!sprite._pinch) {
      return
    }
    sprite.emit('multitouchend')
    sprite._pinch = null
  }
}

sprite.interactive = true;
sprite
.on('touchstart', start)
.on('touchend', end)
.on('touchendoutside', end)
}
