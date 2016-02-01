module ScienceRoomListen {
  export var name = "sciroom_listen"
   export var lines =
   [
     "SPEAK TomBlank You still. Your cooling fans hum idly in the background but you can undoubtedly make out something. Footsteps, coming down the hall. It's him, it's gotta be. `Shit.`",
     "SPEAK TomBlank You were sure he was going to leave you alone today, but, then again, it is your `birthday,` and it's not in his nature to pass up any opportunity to torment you. You steel yourself.",
     "ENTER RIGHT Silas",
     "SPEAK Silas/Face Tom.",
     "ENTER LEFT RobotTom",
     "SPEAK Tom/Face Silas.",
     "SPEAK TomBlank Silas Park. This is the man who made you, as he loves to remind you. As if you'd ever forget. You owe everything to him, you owe your life to him, and you hate him `so much.`",
     "BRANCH 2 Tom/Face sciroom_whatdoyouwant|sciroom_fuckalone|\
      |What do you want? | Leave me the fuck alone.",
   ]
 
  }