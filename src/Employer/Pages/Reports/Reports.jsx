import React from 'react'
import Div from '../../Components/Recordpage/Div'
import Recordtable from '../../Components/Recordpage/Recordtable'
import Reportchart from '../../Components/Recordpage/Reportchart'
import Empense from '../../Components/Recordpage/CompanyExpenses'

 const Reports = () => {
  return (
    <div className='report'>
      <h1 className='clientpage-title'>Office Report</h1>
      <Div />
      <Recordtable />
        <Empense />
      <Reportchart />
    </div>
  )
}

export default Reports
