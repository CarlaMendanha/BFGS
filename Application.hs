{-# LANGUAGE OverloadedStrings    #-}
{-# LANGUAGE TemplateHaskell      #-}
{-# LANGUAGE ViewPatterns         #-}

{-# OPTIONS_GHC -fno-warn-orphans #-}
module Application where

import Foundation
import Yesod
import Home
import Login
import Categoria
import Partida
import Pergunta

mkYesodDispatch "App" resourcesApp
