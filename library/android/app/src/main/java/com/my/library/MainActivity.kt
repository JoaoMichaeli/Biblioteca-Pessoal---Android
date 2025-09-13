package com.my.library

import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Define o tema antes do super.onCreate
        setTheme(R.style.AppTheme)
        super.onCreate(null)

        // Remove FLAG_SECURE para permitir compartilhamento de tela
        window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }

    override fun getMainComponentName(): String = "main"

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return ReactActivityDelegateWrapper(
            this,
            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
            object : DefaultReactActivityDelegate(
                this,
                mainComponentName,
                fabricEnabled
            ){}
        )
    }

    override fun invokeDefaultOnBackPressed() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
            if (!moveTaskToBack(false)) {
                super.invokeDefaultOnBackPressed()
            }
            return
        }
        super.invokeDefaultOnBackPressed()
    }

    // Métodos opcionais para ativar/desativar FLAG_SECURE dinamicamente
    fun enableSecure() {
        window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }

    fun disableSecure() {
        window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
    }
}
