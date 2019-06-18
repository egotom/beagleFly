package com.chat;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v4.app.ActivityCompat;
import android.Manifest;
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
		//if(ContextCompat.checkSelfPermission(this,"Manifest.permission.ACCESS_FINE_LOCATION")!= PackageManager.PERMISSION_GRANTED)
        //{
			ActivityCompat.requestPermissions(MainActivity.this,new String[]{Manifest.permission.ACCESS_FINE_LOCATION},2);
        //}
	}
}
