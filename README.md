# Keymaster - a minigame by Codesign  
 ![Codesign keymaster minigame](https://i.imgur.com/XJnC2AM.jpg)
## Description
Keymaster is a simple skill-based minigame that draws inspiration from rhythm games and that [GTA SA Mission - "Lowrider Challenge".](https://gta.fandom.com/wiki/Lowrider_Challenge)  
  
Players need to press the correct key once it enters the target field. If they are successful they gain points based on their accuracy and lose points if they miss.  
  
The goal of the game is to acquire a set number of points within the given time frame and with a minimal amount of missed keys.  
  
Keymaster has several configurable options ( per game ):  

-   Score
-   Allowed misses
-   Time frame
-   Key sequence
-   Speed increment ( after a successful hit )

  
This allows server managers and devs to adjust the difficulty based on the task players need to complete.  
  
Devs can call the minigame by sending difficulty ( config ) parameters. They will receive a callback once the game is finished ( success or fail ). This allows you to use it anywhere you wish!  
  
Give your players a real challenge with Keymaster and replace those boring progress bars that require nothing but waiting!

## Instructions
HERES AN EXAMPLE HOW TO START THE MINI GAME:

**YOU CAN CUSTOMISE THE SETTINGS BY SENDING THIS TABLE IN THE EXPORT :**

    local CustomSettings = {
        settings = {
            handleEnd = true;  --Send a result message if true and callback when message closed or callback immediately without showing the message
            speed = 10; --pixels / second
            scoreWin = 1000; --Score to win
            scoreLose = -150; --Lose if this score is reached
            maxTime = 60000; --sec
            maxMistake = 5; --How many missed keys can there be before losing
            speedIncrement = 1; --How much should the speed increase when a key hit was successful
        },
        keys = {"a", "w", "d", "s", "g"}; --You can hash this out if you want to use default keys in the java side.
    }

**OR YOU CAN LEAVE IT EMPTY AND THE SCRIPT WILL USE THE DEFAULT VALUES IN THE TABLE IN THE CLIENT.LUA** (line 4).

**WHEN THE MINI GAME UI HAS CLOSED, THE EXPORT WILL RETURN TRUE OR FALSE BASED ON YOUR RESULT.**

*Example 1*

    local example = exports['cd_keymaster']:StartKeyMaster(CustomSettings)
    if example then
        print('im a winner)
    else
        print('i suck so bad)
    end

*Example 2*

    local example = exports['cd_keymaster']:StartKeyMaster()
    if example then
        print('im a winner)
    else
        print('i suck so bad)
    end

