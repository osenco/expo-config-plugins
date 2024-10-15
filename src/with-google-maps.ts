import path from 'path'
import {
	AndroidConfig,
	type ConfigPlugin,
	withAndroidManifest,
	withDangerousMod,
	withPlugins,
} from '@expo/config-plugins'
import { mergeContentsAndSaveAsync } from './utils'

export interface GoogleMapsConfigPluginProps {
	apiKey: string
}

const withGoogleMapsIOS: ConfigPlugin<GoogleMapsConfigPluginProps> = (
	conf,
	{ apiKey },
) => {
	return withDangerousMod(conf, [
		'ios',
		async (config) => {
			await mergeContentsAndSaveAsync(
				path.join(config.modRequest.platformProjectRoot, 'Podfile'),
				{
					tag: 'google-maps-podfile',
					newSrc: [
						'  ',
						"  rn_maps_path = '../node_modules/react-native-maps'",
						"  pod 'react-native-google-maps', :path => rn_maps_path",
					].join('\n'),
					anchor: /use_native_modules!/,
					offset: 0,
					comment: '  #',
				},
			)

			await mergeContentsAndSaveAsync(
				path.join(
					config.modRequest.platformProjectRoot,
					config.modRequest.projectName!,
					'AppDelegate.mm',
				),
				{
					tag: 'google-maps-import',
					newSrc: '#import <GoogleMaps/GoogleMaps.h>',
					anchor: '#import "AppDelegate.h"',
					offset: 1,
					comment: '//',
				},
			)

			await mergeContentsAndSaveAsync(
				path.join(
					config.modRequest.platformProjectRoot,
					config.modRequest.projectName!,
					'AppDelegate.mm',
				),
				{
					tag: 'google-maps-provide-api-key',
					newSrc: `  [GMSServices provideAPIKey:@"${apiKey}"];`,
					anchor: /didFinishLaunchingWithOptions/,
					offset: 2,
					comment: '  //',
				},
			)

			return config
		},
	])
}

const { getMainApplicationOrThrow, addMetaDataItemToMainApplication } =
	AndroidConfig.Manifest

const withGoogleMapsAndroid: ConfigPlugin<GoogleMapsConfigPluginProps> = (
	config,
	{ apiKey },
) => {
	return withAndroidManifest(config, async (modConfig) => {
		const androidManifest = modConfig.modResults
		const mainApplication = getMainApplicationOrThrow(androidManifest)

		addMetaDataItemToMainApplication(
			mainApplication,
			'com.google.android.geo.API_KEY',
			apiKey,
		)

		return modConfig
	})
}

export default ((config, props) =>
	withPlugins(config, [
		[withGoogleMapsIOS, props],
		[withGoogleMapsAndroid, props],
	])) satisfies ConfigPlugin<GoogleMapsConfigPluginProps>
