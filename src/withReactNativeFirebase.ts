import path from 'path'
import {
	type ConfigPlugin,
	withDangerousMod,
	withPlugins,
} from '@expo/config-plugins'
import { mergeContentsAndSaveAsync } from './utils'

const withReactNativeFirebaseIOS: ConfigPlugin = (conf) => {
	return withDangerousMod(conf, [
		'ios',
		async (config) => {
			await mergeContentsAndSaveAsync(
				path.join(config.modRequest.platformProjectRoot, 'Podfile'),
				{
					tag: 'firebase-as-static-framework',
					newSrc: [
						`  $RNFirebaseAsStaticFramework = true`,
						`  pod 'Firebase', :modular_headers => true`,
						`  pod 'FirebaseCore', :modular_headers => true`,
						`  pod 'FirebaseCoreInternal', :modular_headers => true`,
						`  pod 'GoogleUtilities', :modular_headers => true`,
					].join('\n'),
					anchor: /use_native_modules/,
					offset: 1,
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
					tag: `firebase-ios-import`,
					newSrc: '#import <Firebase.h>',
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
					tag: `firebase-ios-configure`,
					newSrc: '  [FIRApp configure];',
					anchor: /- \(BOOL\)application:.*application didFinishLaunchingWithOptions/,
					offset: 2,
					comment: '  //',
				},
			)

			return config
		},
	])
}

/*
const withReactNativeFirebaseAndroid: ConfigPlugin = (conf) => {
	return withDangerousMod(conf, [
		'android',
		async (config) => {
			await mergeContentsAndSaveAsync(
				path.join(
					config.modRequest.platformProjectRoot,
					'build.gradle',
				),
				{
					tag: `firebase-google-services-dependency`,
					newSrc: [
						`        classpath('com.google.gms:google-services:4.3.15')`,
					].join('\n'),
					anchor: 'dependencies {',
					offset: 1,
					comment: '        //',
				},
			)

			await mergeContentsAndSaveAsync(
				path.join(
					config.modRequest.platformProjectRoot,
					'app/build.gradle',
				),
				{
					tag: `firebase-google-services-dependency`,
					newSrc: [
						`apply plugin: 'com.google.gms.google-services'`,
					].join('\n'),
					anchor: `apply plugin: "com.android.application"`,
					offset: 1,
					comment: '//',
				},
			)

			return config
		},
	])
}
*/

export default ((config) =>
	withPlugins(config, [
		withReactNativeFirebaseIOS /* withReactNativeFirebaseAndroid */,
	])) satisfies ConfigPlugin
