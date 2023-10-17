use bevy::app::{App, PluginGroup, Startup};
use bevy::asset::AssetPlugin;
use bevy::DefaultPlugins;
use bevy::math::Vec2;
use bevy::prelude::{Camera2dBundle, Color, Commands};
use bevy::sprite::{Sprite, SpriteBundle};
use bevy::utils::default;
use bevy_akashic::asset::AkashicAssetIoPlugin;
use bevy_akashic::core::AkashicCorePlugins;
use bevy_akashic::window::AkashicWindowPlugin;

fn main() {
    App::new()
        .add_plugins((
            AkashicCorePlugins,
            DefaultPlugins
                .build()
                .add_before::<AssetPlugin, _>(AkashicAssetIoPlugin)
                .add_before::<AkashicAssetIoPlugin, _>(AkashicWindowPlugin),
        ))
        .add_systems(Startup, setup)
        .run();
}


fn setup(
    mut commands: Commands
) {
    commands.spawn(Camera2dBundle::default());

    commands.spawn(SpriteBundle {
        sprite: Sprite {
            custom_size: Some(Vec2::new(50., 50.)),
            color: Color::ORANGE,
            ..default()
        },
        ..default()
    });
}