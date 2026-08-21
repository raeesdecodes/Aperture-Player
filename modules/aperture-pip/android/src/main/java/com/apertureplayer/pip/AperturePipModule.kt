package com.apertureplayer.pip

import android.app.PictureInPictureParams
import android.content.pm.PackageManager
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AperturePipModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("AperturePip")

    AsyncFunction("isPipSupported") {
      val context = appContext.reactContext ?: return@AsyncFunction false
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        return@AsyncFunction context.packageManager.hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE)
      }
      return@AsyncFunction false
    }

    AsyncFunction("enterPipMode") {
      val activity = appContext.currentActivity ?: return@AsyncFunction false
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val params = PictureInPictureParams.Builder().build()
        return@AsyncFunction activity.enterPictureInPictureMode(params)
      }
      return@AsyncFunction false
    }
  }
}
