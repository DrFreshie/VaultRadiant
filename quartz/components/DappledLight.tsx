import { QuartzComponent, QuartzComponentConstructor } from "./types"

const DappledLight: QuartzComponent = () => {
  return (
    <div id="dappled-light">
      <div id="glow"></div>
      <div id="glow-bounce"></div>
      <div class="perspective">
        <div id="leaves"></div>
        <div id="blinds">
          <div class="shutters">
            {Array.from({ length: 23 }).map((_, i) => (
              <div key={i} class="shutter"></div>
            ))}
          </div>
          <div class="vertical">
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
        </div>
      </div>
      <div id="progressive-blur">
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default (() => DappledLight) satisfies QuartzComponentConstructor
