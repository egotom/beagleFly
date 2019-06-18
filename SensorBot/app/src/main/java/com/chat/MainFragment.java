package com.chat;
import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import io.socket.client.Socket;
import io.socket.emitter.Emitter;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.*;
import org.json.JSONObject;
import org.json.JSONException;
import android.Manifest;
import android.support.v4.app.ActivityCompat;

/**
 * A chat fragment containing messages view and input form.
 */
public class MainFragment extends Fragment {

    private static final String TAG = "MainFragment";
    private static final int REQUEST_LOGIN = 0;
    private static final int TYPING_TIMER_LENGTH = 600;

    private RecyclerView mMessagesView;
    private EditText mInputMessageView;
    private List<Message> mMessages = new ArrayList<Message>();
    private RecyclerView.Adapter mAdapter;
    private boolean mTyping = false;
    private Handler mTypingHandler = new Handler();
    private String mUsername;
    private Socket mSocket;
    private Boolean isConnected = true;
	
	private SensorManager mSm;
	private LocationManager mLm;
	private Sensor mGYROSCOPE;
    private Sensor mPRESSURE;
	private Sensor mMAGNETIC;
	private Sensor mACCELEROMETER;
	private JSONObject mNvd=new JSONObject();
	private Context mContext;
	private float[] mAcc;
	private float[] mAgnetics;
	private float[] mOrientation;
	private String mLct;
	private Boolean isUpdate = true;
	
    public MainFragment() {
        super();
    };
    // This event fires 1st, before creation of fragment or any views
    // The onAttach method is called when the Fragment instance is associated with an Activity.
    // This does not mean the Activity is fully initialized.
    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
		mContext=context;
        mAdapter = new MessageAdapter(context, mMessages);
        if (context instanceof Activity){
            //this.listener = (MainActivity) context;
        }
    };
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		ActivityCompat.requestPermissions(MainFragment.this.getActivity(),new String[]{Manifest.permission.ACCESS_FINE_LOCATION},2);
        mUsername="168861";
		mSm=(SensorManager) mContext.getSystemService(Context.SENSOR_SERVICE);
		mLm=(LocationManager)mContext.getSystemService(Context.LOCATION_SERVICE);
        mGYROSCOPE = mSm.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
        mPRESSURE = mSm.getDefaultSensor(Sensor.TYPE_PRESSURE);
		mMAGNETIC = mSm.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
		mACCELEROMETER = mSm.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
		mSm.registerListener(onSChang,mGYROSCOPE,SensorManager.SENSOR_DELAY_UI);
        mSm.registerListener(onSChang,mPRESSURE,SensorManager.SENSOR_DELAY_UI);
		mSm.registerListener(onSChang,mMAGNETIC,SensorManager.SENSOR_DELAY_UI);
		mSm.registerListener(onSChang,mACCELEROMETER,SensorManager.SENSOR_DELAY_UI);
		//SENSOR_DELAY_NORMAL
		mAcc=new float[3];
		mAgnetics=new float[3];

		Criteria criteria = new Criteria();
        //criteria.setAccuracy(Criteria.ACCURACY_HIGH);
        //criteria.setAltitudeRequired(false);
        //criteria.setBearingRequired(false);
        criteria.setCostAllowed(true);
        //criteria.setPowerRequirement(Criteria.POWER_HIGH);
		mLct = mLm.getBestProvider(criteria,false);
		//if (mLct!=null)  		
		//{
		//	try {      
		//		mNvd.put("provider",mLct);
		//	} catch (JSONException e) {
		//		Log.e(TAG, e.getMessage());
		//		return;
		//	}
		//}
		//Location location=mLm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER); 
		//if (location==null)  		
		//{
		//	try {      
		//		mNvd.put("provider",LocationManager.NETWORK_PROVIDER);
		//	} catch (JSONException e) {
		//		Log.e(TAG, e.getMessage());
		//		return;
		//	}
		//}
		//Location location=mLm.getLastKnownLocation(LocationManager.GPS_PROVIDER); 		
		//Location location=mLm.getLastKnownLocation(mLct); 
        //if (location!=null)  showLocation(location); 
		//mLm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 500L, 5F, onLocation);
		mLm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 3000L, 5F, onLocation);
		//mLm.requestLocationUpdates(mLct, 3000L, 5F, onLocation);
        setHasOptionsMenu(true);
        ChatApplication app = (ChatApplication) getActivity().getApplication();
        mSocket = app.getSocket();
        mSocket.on(Socket.EVENT_CONNECT,onConnect);
        mSocket.on(Socket.EVENT_DISCONNECT,onDisconnect);
        mSocket.on(Socket.EVENT_CONNECT_ERROR, onConnectError);
        mSocket.on(Socket.EVENT_CONNECT_TIMEOUT, onConnectError);
        mSocket.on("newMessage", onNewMessage);
        mSocket.on("user joined", onUserJoined);
        mSocket.on("user left", onUserLeft);
        mSocket.on("typing", onTyping);
        mSocket.on("stop typing", onStopTyping);
        mSocket.connect();
        startSignIn();
    };
	public void showLocation(Location location) {
		try {      
			double latitude=location.getLatitude();
			double longitude=location.getLongitude();  
			double altitude=location.getAltitude();
			float bearing=location.getBearing();
			float speed=location.getSpeed();
			long time=location.getTime();
			
			mNvd.put("provider",location.getProvider());
			mNvd.put("latitude",latitude);
			mNvd.put("longitude",longitude);
			mNvd.put("altitude",altitude);
			mNvd.put("bearing",bearing);
			mNvd.put("speed",speed);
			mNvd.put("time",time);
		} catch (JSONException e) {
			Log.e(TAG, e.getMessage());
			return;
		}
		//mSocket.emit("nvg", mNvd);
    };

	private LocationListener onLocation = new LocationListener(){
        //当设备位置发生变化时调用该方法  
        @Override  
		public void onLocationChanged(Location location) {  
            if (location!=null)	showLocation(location);    
			mSocket.emit("nvg", mNvd);
        }
        //当provider的状态发生变化时调用该方法.比如GPS从可用变为不可用.  
        @Override  
		public void onProviderDisabled(String provider) {
			
		}  
        //当provider被打开的瞬间调用该方法.比如用户打开GPS  
        @Override  
		public void onProviderEnabled(String provider){
			
		} 
        @Override  
		public void onStatusChanged(String provider, int status, Bundle extras){
			
		}
	};
	
	private SensorEventListener onSChang = new SensorEventListener() {

        @Override
        public void onSensorChanged(SensorEvent event) {
             switch (event.sensor.getType()) {
				case Sensor.TYPE_ACCELEROMETER: 
					try {                       		
						mNvd.put("xforce",event.values[0]);
						mNvd.put("yforce",event.values[1]);
						mNvd.put("zforce",event.values[2]);
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }		
					mAcc=event.values;
                    break;
				case Sensor.TYPE_MAGNETIC_FIELD:  
					mAgnetics=event.values;
                    break;
				case Sensor.TYPE_GYROSCOPE:  
                    break;
				case Sensor.TYPE_PRESSURE:  
                    break;
				default: 
                     break;
			 }
			float[] A = new float[9];
			float[] B = new float[9];
            float[] mOrientation=new float[3];
			SensorManager.getRotationMatrix(A, B, mAcc, mAgnetics);
			SensorManager.getOrientation(A, mOrientation);
            try {
                mNvd.put("azimuth",mOrientation[0]);
                mNvd.put("pitch",mOrientation[1]);
                mNvd.put("roll",mOrientation[2]);
            } catch (JSONException e) {
                Log.e(TAG, e.getMessage());
            }
			mSocket.emit("nvg", mNvd);
        }

        @Override
        public void onAccuracyChanged(Sensor sensor, int accuracy) {}
    };
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_main, container, false);
    };

    @Override
    public void onDestroy() {
        super.onDestroy();

        mSocket.disconnect();
        mSocket.off(Socket.EVENT_CONNECT, onConnect);
        mSocket.off(Socket.EVENT_DISCONNECT, onDisconnect);
        mSocket.off(Socket.EVENT_CONNECT_ERROR, onConnectError);
        mSocket.off(Socket.EVENT_CONNECT_TIMEOUT, onConnectError);
        mSocket.off("newMessage", onNewMessage);
        mSocket.off("user joined", onUserJoined);
        mSocket.off("user left", onUserLeft);
        mSocket.off("typing", onTyping);
        mSocket.off("stop typing", onStopTyping);
		
		mSm.unregisterListener(onSChang);
        mLm.removeUpdates(onLocation);
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        mMessagesView = (RecyclerView) view.findViewById(R.id.messages);
        mMessagesView.setLayoutManager(new LinearLayoutManager(getActivity()));
        mMessagesView.setAdapter(mAdapter);

        mInputMessageView = (EditText) view.findViewById(R.id.message_input);
        mInputMessageView.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int id, KeyEvent event) {
                if (id == R.id.send || id == EditorInfo.IME_NULL) {
                    attemptSend();
                    return true;
                }
                return false;
            }
        });
        mInputMessageView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (null == mUsername) return;
                if (!mSocket.connected()) return;

                if (!mTyping) {
                    mTyping = true;
                    mSocket.emit("typing");
                }

                mTypingHandler.removeCallbacks(onTypingTimeout);
                mTypingHandler.postDelayed(onTypingTimeout, TYPING_TIMER_LENGTH);
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        ImageButton sendButton = (ImageButton) view.findViewById(R.id.send_button);
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                attemptSend();
            }
        });
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.menu_main, menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_leave) {
            leave();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
	
    private void addLog(String message) {
        mMessages.add(new Message.Builder(Message.TYPE_LOG)
                .message(message).build());
        mAdapter.notifyItemInserted(mMessages.size() - 1);
        scrollToBottom();
    }

    private void addParticipantsLog(int numUsers) {
        addLog(getResources().getQuantityString(R.plurals.message_participants, numUsers, numUsers));
    }

    private void addMessage(String username, String message) {
        mMessages.add(new Message.Builder(Message.TYPE_MESSAGE)
                .username(username).message(message).build());
        mAdapter.notifyItemInserted(mMessages.size() - 1);
        scrollToBottom();
    }

    private void addTyping(String username) {
        mMessages.add(new Message.Builder(Message.TYPE_ACTION)
                .username(username).build());
        mAdapter.notifyItemInserted(mMessages.size() - 1);
        scrollToBottom();
    }

    private void removeTyping(String username) {
        for (int i = mMessages.size() - 1; i >= 0; i--) {
            Message message = mMessages.get(i);
            if (message.getType() == Message.TYPE_ACTION && message.getUsername().equals(username)) {
                mMessages.remove(i);
                mAdapter.notifyItemRemoved(i);
            }
        }
    }

    private void attemptSend() {
        if (null == mUsername) return;
        if (!mSocket.connected()) return;

        mTyping = false;

        String message = mInputMessageView.getText().toString().trim();
        if (TextUtils.isEmpty(message)) {
            mInputMessageView.requestFocus();
            return;
        }
        mInputMessageView.setText("");
        addMessage(mUsername, message);
        // perform the sending message attempt.
        mSocket.emit("newMessage", message);
    }

    private void startSignIn() {
        mSocket.emit("addUser", mUsername);
    }

    private void leave() {
        mUsername = null;
        mSocket.disconnect();
        mSocket.connect();
        startSignIn();
    }

    private void scrollToBottom() {
        mMessagesView.scrollToPosition(mAdapter.getItemCount() - 1);
    }

    private Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if(!isConnected) {
                        if(null!=mUsername)
                            mSocket.emit("addUser", mUsername);
                        Toast.makeText(getActivity().getApplicationContext(),
                                R.string.connect, Toast.LENGTH_LONG).show();
                        isConnected = true;
                    }
                }
            });
        }
    };

    private Emitter.Listener onDisconnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.i(TAG, "diconnected");
                    isConnected = false;
                    Toast.makeText(getActivity().getApplicationContext(),
                            R.string.disconnect, Toast.LENGTH_LONG).show();
                }
            });
        }
    };

    private Emitter.Listener onConnectError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.e(TAG, "Error connecting");
                    Toast.makeText(getActivity().getApplicationContext(),
                            R.string.error_connect, Toast.LENGTH_LONG).show();
                }
            });
        }
    };

    private Emitter.Listener onNewMessage = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String username;
                    String message;
                    try {
                        username = data.getString("username");
                        message = data.getString("message");
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }

                    removeTyping(username);
                    addMessage(username, message);
                }
            });
        }
    };

    private Emitter.Listener onUserJoined = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String username;
                    int numUsers;
                    try {
                        username = data.getString("username");
                        numUsers = data.getInt("numUsers");
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }

                    addLog(getResources().getString(R.string.message_user_joined, username));
                    addParticipantsLog(numUsers);
                }
            });
        }
    };

    private Emitter.Listener onUserLeft = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String username;
                    int numUsers;
                    try {
                        username = data.getString("username");
                        numUsers = data.getInt("numUsers");
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }

                    addLog(getResources().getString(R.string.message_user_left, username));
                    addParticipantsLog(numUsers);
                    removeTyping(username);
                }
            });
        }
    };

    private Emitter.Listener onTyping = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String username;
                    try {
                        username = data.getString("username");
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }
                    addTyping(username);
                }
            });
        }
    };

    private Emitter.Listener onStopTyping = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    String username;
                    try {
                        username = data.getString("username");
                    } catch (JSONException e) {
                        Log.e(TAG, e.getMessage());
                        return;
                    }
                    removeTyping(username);
                }
            });
        }
    };

    private Runnable onTypingTimeout = new Runnable() {
        @Override
        public void run() {
            if (!mTyping) return;

            mTyping = false;
            mSocket.emit("stop typing");
        }
    };
}

