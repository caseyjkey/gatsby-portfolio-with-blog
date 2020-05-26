import React, { useState } from 'react'
import { Animated } from 'react-animated-css'
import { Waypoint } from 'react-waypoint'

export default function Info({type, info, Icon, link}) {
  const [visible, setVisible] = useState(false);
  const makeVisible = () => setVisible(true);
  
  return (
    <Animated animationIn="fadeInUp" isVisible={visible}>
      <div className="align-self-stretch box text-center p-4 shadow">
        <div className="icon d-flex align-items-center justify-content-center">
          <span><Icon /></span>
        </div>
        <Waypoint onEnter={makeVisible}></Waypoint>
        <div>
          <h3 className="mb-4">{type}</h3>
          <p>{link && <a href={link}>{info}</a>}
             {!link && info}
          </p>
        </div>
      </div>
    </Animated>
  );
}