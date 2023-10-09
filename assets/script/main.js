module.exports = (param) => {
    g.E.prototype.z = 0

    g.isNode = () => (typeof window == 'undefined')
    g.create_screen_surface = () => {
        const surface = g.game.resourceFactory.createSurface(g.game.width, g.game.height)
        const bevyCanvas = surface._drawable
        bevyCanvas.setAttribute("data-raw-handle", "1")

        const akashicCanvas = g.game.renderers[0].surface.canvas
        akashicCanvas.parentElement.appendChild(bevyCanvas)
        akashicCanvas.style.opacity = "0"
        bevyCanvas.style.position = "absolute"

        g.akashicCanvas = () => akashicCanvas
        g.canvasRect = () => bevyCanvas.getBoundingClientRect()
        bevyCanvas.style.left = `0px`
        bevyCanvas.style.top = `0px`
        bevyCanvas.style.width = `100%`
        bevyCanvas.style.height = `100%`
        bevyCanvas.width = akashicCanvas.width
        bevyCanvas.height = akashicCanvas.height

        bevyCanvas.onpointerdown = (e) => {
            document.body.setPointerCapture(e.pointerId)
        }

        document.body.onpointermove = (e) => {
            const rect = bevyCanvas.getBoundingClientRect()

            g.game.raiseEvent(new g.MessageEvent({
                data_type_name: "env_bevy::input::pointer::moved::PointMoveData",
                data: {
                    movementX: e.movementX ,
                    movementY: e.movementY,
                    clientX: e.clientX - rect.left,
                    clientY: e.clientY  - rect.top
                }
            }))
        }


        bevyCanvas.onpointerenter = () => {
            g.game.raiseEvent(new g.MessageEvent({
                data_type_name: "env_bevy::input::pointer::enter::CursorEnterData",
                data: {}
            }))
        }

        bevyCanvas.onpointerleave = () => {
            g.game.raiseEvent(new g.MessageEvent({
                data_type_name: "env_bevy::input::pointer::cancel::CursorLeftData",
                data: {}
            }))
        }

        return surface
    }

    g.getEntityProperties = (entity) => ({
        id: entity.id,
        x: entity.x,
        y: entity.y,
        z: entity.z,
        width: entity.width,
        height: entity.height,
        angle: entity.angle,
        scaleX: entity.scaleX,
        scaleY: entity.scaleY,
        anchorX: entity.anchorX,
        anchorY: entity.anchorY,
        touchable: entity.touchable,
        visible: entity.visible()
    })

    g.feedFilledRectProperties = (entity, cssColor) => {
        entity.cssColor = cssColor
        entity.modified()
    }

    g.feedLabelProperties = (entity, text, textAlign, textColor, widthAutoAdjust) => {
        entity.text = text
        entity.textAlign = textAlign
        entity.textColor = textColor
        entity.widthAutoAdjust = widthAutoAdjust
        entity.invalidate()
    }

    const halfWidth = g.game.width / 2
    const halfHeight = g.game.height / 2

    g.feedEntityProperties = (entity, x, y, z, angle, width, height, scaleX, scaleY, anchorX, anchorY, touchable, visible) => {
        entity.angle = angle;
        entity.z = z
        entity.resizeTo(width, height)
        const parent = entity.parent

        if (parent && !(parent instanceof g.Scene)) {
            entity.moveTo(x + parent.width / 2, parent.height / 2 - y)
        } else {
            entity.moveTo(x + halfWidth, halfHeight - y)
        }

        entity.scale(scaleX, scaleY)
        entity.anchor(anchorX, anchorY)
        entity.touchable = touchable
        if (visible && !entity.visible()) {
            entity.show()
        } else if (!visible && entity.visible()) {
            entity.hide()
        }
        entity.modified()
    }

    if (typeof window == 'undefined') {
        globalThis.crypto = {
            getRandomValues: (args) => new Uint8Array(args.map(_ => Math.floor(g.game.random.generate() * 255)))
        }
    }

    const scene = new g.Scene({
        game: g.game, assetPaths: ["/assets/**/*"]
    })

    scene.onLoad.add(() => {
        g.snapshot = () => {
            if (Array.isArray(param.snapshot)) {
                return param.snapshot
            } else {
                return []
            }
        }

        scene.onMessage.add((event) => {

            if (!event.data || !event.data.snap) {
                return;
            }

            g.game.requestSaveSnapshot(() => {
                return {snapshot: event.data.data}
            })
        })
        if (typeof window == 'undefined') {
            return;
        }
        const wasm = require("./akashic")

        g.read_asset_binaries = (path) => {
            try {
                const data = scene.asset.getBinaryData(path)
                return new Uint8Array(data)
            } catch {
                return null
            }
        }

        wasm.pass(g)
        wasm.init()
    })

    g.game.pushScene(scene)
}