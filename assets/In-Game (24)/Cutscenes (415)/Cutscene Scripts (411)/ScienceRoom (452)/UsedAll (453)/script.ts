module ScienceRoomUsedAll {
  
  export var name = "sciroom_usedall"
        
  export var lines =
      [
        "ENTER LEFT Security",
        "ANIMATE LEFT Idle",
        "SPEAK Security You got a recepit, man?",
        "LOADIFITEM Card security_pass",
        //if no receipt, continues
        "ENTER RIGHT RobotTom",
        "SPEAK Tom/Face Oh, uh... no.",
        "SPEAK Security You gotta go pay, man.",
        "SPEAK Tom/Face yeah, of course, sorry.",
        "END",
      ]
        
}