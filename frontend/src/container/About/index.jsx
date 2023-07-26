import React from 'react'
import Header from '@/components/Header'

import s from './style.module.less'

const About = () => {
  return <>
    <Header title='About us' />
    <div className={s.about}>
      <h2>About this app</h2>
      <article>This App can help people manage their daily incomes and expenses.</article>
      <h2>About the author</h2>
      <article>
        A enthusiastic developer in CMU!
      </article>
    </div>
  </>
};

export default About;