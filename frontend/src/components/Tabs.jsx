import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './Tabs.css'

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  return (
    <div>
      <div className='tabs'>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab ${index === activeTab ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className='tab-content'>
        {tabs[activeTab].content}
      </div>
    </div>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.array.isRequired
}

export default Tabs
