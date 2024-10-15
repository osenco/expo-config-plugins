import { withAndroidManifest, withInfoPlist } from "@expo/config-plugins";
import { ExpoConfig } from "expo/config";

export default function manifestPlugin(config: ExpoConfig) {
	const plistConfig = withInfoPlist(config, config => {
		config.modResults.CFBundleAllowMixedLocalizations = true;
		return config;
	});

	return withAndroidManifest(plistConfig, async config => {
		config.modResults.manifest["uses-feature"] = [
			{
				$: {
					"android:name": "android.hardware.camera",
					"android:required": "false",
				},
			},
		];

		return config;
	});
}
