module ScienceRoomUsedAll {
  
  export var name = "sciroom_usedall"
        
  export var lines =
      [
        "ENTER LEFT RobotTom",
        "SPEAK Tom/Face Oh, it's silas. Great.",
        "ENTER RIGHT Silas",
        "BRANCH 2 Silas/Face sciroom_usedyes|sciroom_usedno|\
          Do you want to go to Cyberspace? \
          |Yeah|No"
      ]
        
}