const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withPipSupport(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application?.[0];

    if (application && application.activity) {
      const mainActivity = application.activity.find(
        (act) => act['$'] && act['$']['android:name'] === '.MainActivity',
      );

      if (mainActivity) {
        mainActivity['$']['android:supportsPictureInPicture'] = 'true';
        mainActivity['$']['android:configChanges'] =
          'keyboard|keyboardHidden|orientation|screenSize|screenLayout|smallestScreenSize|uiMode';
      }
    }

    return config;
  });
};
