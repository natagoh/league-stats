import React from 'react'
import { useParams } from 'react-router'

export default function StatsPage() {
  let { username } = useParams();
  return (
    <div>
      {username}
    </div>
  )
}
