import { Component, OnInit } from '@angular/core';
import {
  dmUnity,
  dmPhotoshop,
  dmIllustrator,
  dmInDesign,
  dmNationBuilder,
  dmBootstrap,
  dmCSharp
} from '../shared/icon-definitions';
import {
  faAngular,
  faCss3Alt,
  faHtml5,
  faJs,
  faLess,
  faPhp,
  faReact,
  faWordpressSimple
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'dm-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  icons = {
    html: faHtml5,
    css: faCss3Alt,
    javascript: faJs,
    wordpress: faWordpressSimple,
    less: faLess,
    php: faPhp,
    react: faReact,
    angular: faAngular,
    unity: dmUnity,
    photoshop: dmPhotoshop,
    illustrator: dmIllustrator,
    inDesign: dmInDesign,
    nationBuilder: dmNationBuilder,
    bootstrap: dmBootstrap,
    cSharp: dmCSharp
  };

  // TODO: Move data to Firebase
  skillGraphs = [
    {
      heading: 'Languages',
      skills: [
        { class: 'html',        label: 'HTML/CSS',      rank: 10 },
        { class: 'js',          label: 'JavaScript',    rank:  8 },
        { class: 'ts',          label: 'TypeScript',    rank:  7 },
        { class: 'php',         label: 'PHP',           rank:  6 },
        { class: 'csharp',      label: 'C#',            rank:  3 }
      ]
    },
    {
      heading: 'Tools & Frameworks',
      skills: [
        { class: 'angular',     label: 'Angular',       rank:  6 },
        { class: 'react',       label: 'React',         rank:  3 },
        { class: 'bootstrap',   label: 'Bootstrap',     rank:  9 },
        { class: 'wordpress',   label: 'WordPress',     rank: 10 },
        { class: 'firebase',    label: 'Firebase',      rank:  5 }
      ]
    },
    {
      heading: 'Software',
      skills: [
        { class: 'photoshop',   label: 'Photoshop',     rank: 10 },
        { class: 'illustrator', label: 'Illustrator',   rank:  8 },
        { class: 'jetbrains',   label: 'JetBrains IDE', rank:  5 },
        { class: 'vscode',      label: 'VS Code',       rank:  7 },
        { class: 'unity',       label: 'Unity',         rank:  3 }
      ]
    }
  ];

  timelineMilestones = [
    {
      year: '2010',
      icons: [
        { class: 'photoshop', iconDef: this.icons.photoshop },
        { class: 'html', iconDef: this.icons.html },
        { class: 'css', iconDef: this.icons.css }
      ],
      content: `Started freelancing for friends with basic HTML and CSS`
    },
    {
      year: '2011',
      icons: [
        { class: 'illustrator', iconDef: this.icons.illustrator },
        { class: 'indesign', iconDef: this.icons.inDesign },
        { class: 'javascript', iconDef: this.icons.javascript },
        { class: 'wordpress', iconDef: this.icons.wordpress }
      ],
      content: `Started my first web design and development job, where I started
        using other tools in the Adobe suite and got my feet wet with
        JavaScript and WordPress`
    },
    {
      year: '2014',
      icons: [
        { class: 'nationbuilder', iconDef: this.icons.nationBuilder },
        { class: 'less', iconDef: this.icons.less }
      ],
      content: `Earned my NationBuilder &ldquo;Architect&rdquo; certification by learning
        how to use Less, mobile-first design and development principles,
        and NationBuilder&rsquo;s proprietary technologies and toolset`
    },
    {
      year: '2015',
      icons: [
        { class: 'php', iconDef: this.icons.php },
        { class: 'bootstrap', iconDef: this.icons.bootstrap }
      ],
      content: `Learned PHP and started using WordPress&rsquo;s API and Bootstrap
        to develop custom responsive themes from scratch`
    },
    {
      year: '2016',
      icons: [
        { class: 'unity', iconDef: this.icons.unity },
        { class: 'csharp', iconDef: this.icons.cSharp }
      ],
      content: `Started learning game development with Unity in my free time, where
        I learned the fundamentals of Object Oriented Programming, design
        patterns, and component-based software architecture`
    },
    {
      year: '2018',
      icons: [
        { class: 'angular', iconDef: this.icons.angular },
        { class: 'react', iconDef: this.icons.react }
      ],
      content: `Started learning modern web application development frameworks`
    }
  ];

  constructor() {}

  ngOnInit() {}

}
