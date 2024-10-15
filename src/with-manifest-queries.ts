import {
	withAndroidManifest,
	withInfoPlist,
	type ConfigPlugin,
} from "@expo/config-plugins";
import { ExpoConfig } from "expo/config";

export default function manifestPlugin(config: ExpoConfig) {
	const plistConfig = withInfoPlist(config, config => {
		config.modResults.CFBundleAllowMixedLocalizations = true;
		return config;
	});

	const withManifestQueries: ConfigPlugin<{
		queries: {}[];
	}> = async (config, { queries }) => {
		config.modResults.manifest.queries = [
			{
				intent: [
					{
						action: [
							{
								$: {
									"android:name":
										"android.intent.action.SENDTO",
								},
							},
						],
						data: [{ $: { "android:scheme": "mailto" } }],
					},
					{
						action: [
							{
								$: {
									"android:name":
										"android.intent.action.DIAL",
								},
							},
						],
					},
				],
			},
		];

		return config;
	};

	return withAndroidManifest(plistConfig, (config, props) => withManifestQueries(config, props));
}
