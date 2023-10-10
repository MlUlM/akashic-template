use akashic::font::dynamic::DynamicFontBuilder;
use akashic::font::font_family::FontFamily;
use akashic::object2d::Object2D;
use akashic::prelude::*;

fn main() {
    let font = DynamicFontBuilder::new(FontFamily::new("sans-serif"), 31.).build();
    let label = LabelBuilder::new("Hello World!", font).build();

    let x = GAME.width() * 0.5 - label.width() * 0.5;
    let y = GAME.height() * 0.5 - label.height() * 0.5;
    label.move_to(x, y);

    GAME
        .scene()
        .append(&label);
}


