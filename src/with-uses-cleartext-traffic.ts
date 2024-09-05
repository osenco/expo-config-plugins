import {
	AndroidConfig,
	type ConfigPlugin,
	withAndroidManifest,
} from '@expo/config-plugins'

const { getMainApplicationOrThrow } = AndroidConfig.Manifest

const withUsesCleartextTraffic: ConfigPlugin = (config) => {
	return withAndroidManifest(config, async (modConfig) => {
		const androidManifest = modConfig.modResults
		const mainApplication = getMainApplicationOrThrow(androidManifest)
		mainApplication.$['android:usesCleartextTraffic'] = 'true'
		return modConfig
	})
}

export default withUsesCleartextTraffic
