/* 
Notes on springs:

* It takes fewer steps to animate fast springs than slow springs. In other words,
  steps-per-ms is constant. What changes is how drastically the states
  change at each step.

*/

function roundTo(num: number, decimals: number) {
  // Round a number to a given number of decimal places.
  const d = Math.pow(10, decimals);
  return Math.round(num * d) / d;
}

function id() {
  return Math.random().toString(16).substring(2, 10);
}

function dampenedHookeForce(
  displacement: number,
  velocity: number,
  stiffness: number,
  damping: number
) {
  //
  // @TODO look at proper Verlet integration.
  //
  // Hooke's Law -- the basic spring force.
  // <http://en.wikipedia.org/wiki/Hooke%27s_law>
  //
  //     F = -kx
  //
  // Where:
  // x is the vector displacement of the end of the spring from its equilibrium,
  // k is a constant describing the tightness of the spring.
  const hookeForce = -1 * (stiffness * displacement);

  // Applying friction to Hooke's Law for realistic physics
  // <http://gafferongames.com/game-physics/spring-physics/>
  //
  //     F = -kx - bv
  //
  // Where:
  // b is damping (friction),
  // v is the relative velocity between the 2 points.
  return hookeForce - damping * velocity;
}

function particle(x: number, velocity: number, mass: number) {
  return {
    x: x || 0,
    velocity: velocity || 0,
    mass: mass || 1
  };
}

function tick(particle: any, stiffness: number, damping: number) {
  // "Tick" a particle given a spring force.
  // Mutates the particle object!
  const force = dampenedHookeForce(
    particle.x,
    particle.velocity,
    stiffness,
    damping
  );

  // Acceleration = force / mass.
  const acceleration = force / particle.mass;

  // Increase velocity by acceleration.
  particle.velocity += acceleration;
  // Update distance from resting.
  particle.x += particle.velocity;

  return particle;
}

function isParticleResting(particle: any) {
  // Find out if a particle is at rest.
  // Returns a boolean.
  return Math.round(particle.x) === 0 && Math.abs(particle.velocity) < 0.2;
}

function accumulateCurvePoints(
  x: number,
  velocity: number,
  mass: number,
  stiffness: number,
  damping: number
) {
  // Accumulate all states of a spring as an array of points.
  // Returns an array representing x values over time..

  // Create a temporary particle object.
  const p = particle(x, velocity, mass);

  // Create a points array to accumulate into.
  const points = [];

  while (!isParticleResting(p)) {
    if (points.length === 200) {
      console.log('SOMETHINGS WRONG ABORT ABORT');
      return points;
    }
    points.push(tick(p, stiffness, damping).x);
  }

  return points;
}

function asCssRule(key: string, value: string) {
  return key + ':' + value + ';';
}

function asCssStatement(identifier: string, cssString: string) {
  return identifier + '{' + cssString + '}';
}

function generateAnimationCss(
  points: any[],
  name: string,
  duration: string,
  mapper: (x: number) => string
) {
  // Create a hardware-accelarated CSS Keyframe animation from a series of points,
  // an animation name and a mapper function that returns a CSS string for
  // a given point distance.

  // Convert to range from 0 - 100 (for 0% - 100% keyframes).
  const frameSize = 100 / (points.length - 1);

  // Build keyframe string
  const keyframes = points.reduce((frames, point, i) => {
    // Create the percentage key for the frame. Round to nearest 5 decimals.
    const percent = roundTo(frameSize * i, 5);
    // Wrap the mapped point value in a keyframe. Mapper is expected to return
    // a valid set of CSS properties as a string.
    return frames + asCssStatement(percent + '%', mapper(point)) + '\n';
  }, '');

  // Wrap keyframe string into @keyframes statement. Give animation a name
  // so we can reference it.
  const keyframeStatement = asCssStatement(
    '@keyframes ' + name + ' ',
    keyframes
  );

  // Build properties string for our animation classname.
  const properties =
    asCssRule('animation-duration', duration) +
    asCssRule('animation-name', name) +
    asCssRule('animation-timing-function', 'linear') +
    asCssRule('animation-fill-mode', 'both');

  // Wrap properties string as a CSS class statement. Give class same name
  // as animation.
  // var animationStatement = asCssStatement('.' + name, properties);

  // Return our combined animation rule set string.
  return {
    keyframes: keyframeStatement,
    animationStyles: properties
  };
}

function appendStyle(headEl: HTMLElement, css: string) {
  // Create a new style element.
  const styleEl = document.createElement('style');
  // Assign the text content.
  styleEl.textContent = css;
  // Append style to head.
  headEl.appendChild(styleEl);
  return styleEl;
}

/**
 * @param x Initial displacement (px)
 * @param velocity Initial velocity (px/s)
 * @param mapper CSS Keyframe mapper
 */
export function animateSpringViaCss(
  x: number,
  velocity: number,
  mass: number,
  stiffness: number,
  damping: number,
  mapper: (x: number) => string,
  fps?: number
) {
  fps = fps || 60;

  // Accumulate the points of the spring curve
  // Divide velocity by fps for velocity in px/frame
  const points = accumulateCurvePoints(
    x,
    velocity / fps,
    mass,
    stiffness,
    damping
  );

  // Compute the timespan of the animation based on the number of frames we
  // have and the fps we desire.
  const duration = points.length / fps * 1000;

  // Generate a unique name for this animation.
  const name = 'spring-' + id();

  // Create CSS animation classname.
  const css = generateAnimationCss(points, name, duration + 'ms', mapper);

  // Create style element and append it to head element.
  const styleEl = appendStyle(document.head, css.keyframes);

  return {
    animationStyles: css.animationStyles,
    callback: () => {
      // Remove animation classname and styles. We're done with it.
      document.head.removeChild(styleEl);
    }
  };
}

export function animateSpring(
  x: number,
  velocity: number,
  mass: number,
  stiffness: number,
  damping: number,
  callback: (x: number) => void
) {
  /* Animate a spring force from its current state to resting state.
    Takes a callback which will be called with the x position over and over
    and over until the spring is at rest. */

  // Create a temporary particle object.
  const p = particle(x, velocity, mass);

  const requestAnimationFrame = window.requestAnimationFrame;

  function looper() {
    tick(p, stiffness, damping);
    if (isParticleResting(p)) {
      return;
    }
    callback(p.x);
    requestAnimationFrame(looper);
  }

  looper();
}
