module ScienceRoomListen {
  export var name = "sciroom_listen"
   export var lines =
   [
     "SPEAK TomBlank You still. Your cooling fans hum idly in the background but you can undoubtedly make out something. Footsteps, coming down the hall. It's him, it's gotta be. `Shit.`",
     "SPEAK TomBlank You were sure he was going to leave you alone today, but, then again, it is your `birthday,` and it's not in his nature to pass up any opportunity to torment you. You steel yourself.",
     "ENTER RIGHT Silas",
     "SPEAK Silas Tom.",
     "ENTER LEFT RobotTom",
     "SPEAK RobotTom Silas.",
     "SPEAK TomBlank Silas Park. This is the man who made you, as he loves to remind you. As if you'd ever forget. You owe everything to him, you owe your life to him, and you hate him `so much.`",
    
     "BRANCH 2 RobotTom sciroom_whatdoyouwant|sciroom_fuckalone|\
      |What do you want? | Leave me the fuck alone.",
   ]
 
  }

module ScienceRoomWant{
  export var name = "sciroom_whatdoyouwant"
  export var lines =
    [ "ENTER RIGHT Silas",
      "ENTER LEFT RobotTom",
      "SPEAK Silas I came down here to reward some good behavior.",
      "SPEAK TomBlank You say nothing, and wait for Silas to continue.",

     "END"
    ]
}

module ScienceRoomFuckAlone{
  export var name = "sciroom_fuckalone"
  export var lines = [ 
    "ENTER RIGHT Silas",
    "ENTER LEFT RobotTom",
    "SPEAK TomBlank Your artificial gut turns at Silas's scowl. `Mistake.` You back up against the cold metal dresser, grip the edge tight.",
    "SPEAK Silas Watch it. I came down here to reward some good behavior, but maybe you haven't deserved it. Maybe I should just shut you down for the next month, for all the trouble you're giving me.",
    
    "BRANCH 2 Tom sciroom_fuckyou|sciroom_tongue|\
    |\"Fuck you.\" | `Hold your tongue`",
  ]
}

module ScienceRoomFuckYou{        
  export var name = "sciroom_fuckyou";
  export var lines = [
    "ENTER RIGHT Silas",
    "ENTER LEFT RobotTom",
    "SPEAK TomBlank Don't be stupid. You daydream about spitting the curses at him and clocking him in the jaw, but you know you can't. Shouldn't.",
    "SPEAK TomBlank Being powered down is `scary,` you don't really know how to describe it. You think it might be like dying.",
    "SPEAK TomBlank So you say nothing, and wait for Silas to continue.",
    
    "END"
  ]

}

module ScienceRoomHoldTongue{        
  export var name = "sciroom_holdtongue";
  export var lines = [
    "ENTER RIGHT Silas",
    "ENTER LEFT RobotTom",
    "SPEAK TomBlank You say nothing, and wait for Silas to continue.",
    
    "END"
  ]

}