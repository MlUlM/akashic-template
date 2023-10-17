use akashic::game::GAME;
use bevy::app::{App, PluginGroup};
use bevy::asset::AssetPlugin;
use bevy::DefaultPlugins;
use bevy::utils::default;

fn main() {
    App::new()
        .add_plugins((
            AkashicCorePlugins,
            DefaultPlugins
                .build()
                .add_before::<AssetPlugin, _>(AkashicAssetIoPlugin)
                .add_before::<AkashicAssetIoPlugin, _>(AkashicWindowPlugin),
        ))
        .run();
}



fn setup(
    mut commands: Comma
){

}