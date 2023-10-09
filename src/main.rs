use akashic::game::GAME;
use bevy::app::{App, PluginGroup};
use bevy::asset::AssetPlugin;
use bevy::DefaultPlugins;
use bevy::utils::default;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(AssetPlugin{
            asset_folder: format!("{}/assets", GAME.asset_base()),
            ..default()
        }))

        .run();
}



