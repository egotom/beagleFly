

2、目录结构
   Auto navigation        导航代码，方向角导航，最大弧线导航...,各种牛逼的导航算法。
   doc                    包含了一个flitetest 网站上的航模制作图纸。机翼的做法可以参考这些图纸。
   node_modules           包含了控制器用到的各种node.js库文件。考虑到大家翻墙的困难，这是很有必要的。
   pid                    包含了自动驾驶要用的PID算法，和PID自整定算法。基本都是我从Arduino的C语言代码移植到node.js代码，还没经过测试。
   public                 这个目录是无人机的控制界面代码。
   SensorBot              这是一个Android手机的传感器机器人App项目，Java代码。App一旦运行就会自动使用ip/tcp连接RPi和地面控制站, 发送传感器数据。包括地磁传感器，陀螺仪，加速度传感器，温度传感器，气压压传感器，GPS，视频等。
   app.js                 无人机服务器代码。起到接收机和控制器的作用。
   package-lock.json      node.js库配置文件。
   
3、硬件
   30A无刷电机电子调速器ESC  × 2
   9g舵机                    × 3
   5030三叶正反螺旋桨
   2212外转子无刷电机 1000kv × 2
   3S3P 8.4Ah锂离子电池组(3×3 1865电池组)
   Raspberry Pi Model 3B
   Android 手机
   USB转TTL通讯模块
   DC12V转5V降压模块
   其他工具及相应配件
   
4、软件
   raspbian    node.js   Android Sensor Service
   
5、运行
   项目部署到Raspberry Pi后关闭nginx或者Apache服务器，确保80端口没被占用。
   启动 $ node app.js       
   任意浏览器连接，例如：http://192.168.1.106  出现控制界面。界面右上角有一个摇摆的狗子，点击它可以查看具体操作说明。
	
