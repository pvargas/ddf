/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import * as React from 'react'
import styled from 'styled-components'
import { hot } from 'react-hot-loader'
import Dropdown from '../presentation/dropdown'
import MenuAction from '../menu-action'
import NavigationBehavior from '../navigation-behavior'
import { ContextType } from '../presentation/dropdown'
// import * as Cesium from 'cesium'

const Clipboard = require('clipboard')
const announcement = require('component/announcement')

type Props = {
  coordinateValues: {
    lat: string
    lon: string
    mgrs: string
    utmUps: string
  }
  closeParent: () => void
}

let startLat: string
let startLon: string
let endLat: string
let endLon: string

const Label = styled.div`
  display: inline-box;
  margin-left: ${props => props.theme.minimumSpacing};
`
const Icon = styled.div`
  margin-left: ${props => props.theme.minimumSpacing};
  display: inline-block;
  text-align: center;
  width: ${props => props.theme.minimumFontSize};
`

const CustomDropdown = styled(Dropdown as any)`
  width: 100%;
`

const Text = styled.div`
  line-height: 1.2rem;
`

const Description = styled.div`
  opacity: ${props => props.theme.minimumOpacity};
`

const endHandler = (
  lat: string,
  lon: string,
  text: string,
  context: ContextType,
  closeParent: () => void
) => {
  return (e: React.MouseEvent) => {
    const clipboardInstance = new Clipboard(e.target, {
      text: () => {
        return text
      },
    })

    clipboardInstance.on('error', (e: any) => {
      announcement.announce({
        title: 'Press Ctrl+C to copy',
        message: e.text,
        type: 'info',
      })
    })

    endLat = lat
    endLon = lon
    measureDistance(startLat, startLon, endLat, endLon)
    clipboardInstance.onClick(e)
    clipboardInstance.destroy()
    context.closeAndRefocus()
    closeParent()
  }
}

const startHandler = (
  lat: string,
  lon: string,
  text: string,
  context: ContextType,
  closeParent: () => void
) => {
  return (e: React.MouseEvent) => {
    const clipboardInstance = new Clipboard(e.target, {
      text: () => {
        return text
      },
    })
    clipboardInstance.on('success', (e: any) => {
      announcement.announce({
        title: 'Starting point set',
        message: e.text,
        type: 'success',
      })
    })
    clipboardInstance.on('error', (e: any) => {
      announcement.announce({
        title: 'Press Ctrl+C to copy',
        message: e.text,
        type: 'info',
      })
    })

    startLat = lat
    startLon = lon
    clipboardInstance.onClick(e)
    clipboardInstance.destroy()
    context.closeAndRefocus()
    closeParent()
  }
}

const measureDistance = (
  startLat: string,
  startLon: string,
  endLat: string,
  endLon: string
) => {
  var radius = 6371e3
  var lat1 = parseFloat(startLat) / (180 / Math.PI)
  var lat2 = parseFloat(endLat) / (180 / Math.PI)

  var dp = (parseFloat(endLat) - parseFloat(startLat)) / (180 / Math.PI)
  var dl = (parseFloat(endLon) - parseFloat(startLon)) / (180 / Math.PI)

  var a =
    Math.sin(dp / 2) * Math.sin(dp / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dl / 2) * Math.sin(dl / 2)

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var distance = Math.round(radius * c)
  let d: string
  if (distance < 1000) {
    d = distance + ' m'
  } else {
    d = distance / 1000 + ' Km'
  }

  announcement.announce({
    title: 'Distance',
    message: d,
    type: 'success',
  })

  return d
}

const render = (props: Props) => {
  const { lat, lon } = props.coordinateValues
  const { closeParent } = props

  return (
    <CustomDropdown
      content={(context: ContextType) => (
        <NavigationBehavior>
          <MenuAction
            icon="fa fa-clipboard"
            data-help="Copies the coordinates to your clipboard."
            onClick={startHandler(
              lat,
              lon,
              `${lat} ${lon}`,
              context,
              closeParent
            )}
          >
            <Text>
              <Description>Set starting point</Description>
              {lat + ' ' + lon}
            </Text>
          </MenuAction>

          <MenuAction
            icon="fa fa-clipboard"
            data-help="Copies the DMS coordinates to your clipboard."
            onClick={endHandler(
              lat,
              lon,
              `${lat} ${lon}`,
              context,
              closeParent
            )}
          >
            <Text>
              <Description>Set ending point</Description>
              {lat + ' ' + lon}
            </Text>
          </MenuAction>
        </NavigationBehavior>
      )}
    >
      <div className="metacard-interaction interaction-copy-coordinates">
        <div className="interaction-icon fa fa-clipboard" />
        <Label className="interaction-text">
          Measure distance
          <Icon className="fa fa-chevron-down fa-chevron-withmargin" />
        </Label>
      </div>
    </CustomDropdown>
  )
}

export default hot(module)(render)
