// Angular imports
import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';

// Dependency imports
import { Subscription } from 'rxjs';
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

// App imports
import { DataHandler } from '../shared/data-handler.service';
import { Employer, createEmployer } from './employer.model';
import { Project } from '../projects/project.model';
import {
  dmBootstrap,
  dmCloud9,
  dmCSharp,
  dmIllustrator,
  dmInDesign,
  dmNationBuilder,
  dmPhotoshop,
  dmUnity
} from '../shared/icon-definitions';
import { ProjectsService } from '../projects/projects.service';
import { DeviceDetectorService } from 'ngx-device-detector';

// Component config
@Component({
  selector: 'dm-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit, OnDestroy {

  // Data
  employers: Employer[] = [];
  projects: Project[];
  years: { year: number, employers?: Employer[] }[] = [
    { year: 2018 },
    { year: 2017 },
    { year: 2016 },
    { year: 2015 },
    { year: 2014 },
    { year: 2013 },
    { year: 2012 },
    { year: 2011 },
    { year: 2010 }
  ];
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
    cSharp: dmCSharp,
    cloud9: dmCloud9
  };

  // State
  activeEmployer: Employer;
  activeYear: { year: number, employers?: Employer[] };
  singleYearHeight: number;
  activeEmployerContentHeight = 24;

  // Subs
  dataSub: Subscription;

  // Services
  constructor(
    private dataHandler: DataHandler,
    private projectsService: ProjectsService,
    private renderer: Renderer2,
    private elem: ElementRef,
    public deviceDetector: DeviceDetectorService
  ) {}

  // Init
  ngOnInit() {
    this.dataSub = this.dataHandler.watchCollection('employment').subscribe(
      data => this.createEmployers(data),
      error => console.log(error)
    );
    this.projectsService.watchProjects();
  }

  @HostListener('window:resize')
  onResize() {
    this.setSingleYearHeight();
  }

  // Events
  createEmployers(data) {
    for (const datum of data) {
      this.employers.push(createEmployer(
        datum.id,
        datum.companyName,
        datum.title,
        datum.dateStart,
        datum.dateEnd,
        datum.order
      ));
    }
    if (this.deviceDetector.isDesktop()) {
      this.addEmployersToYears();
    }
    if (!this.activeEmployer) {
      this.onSetActive(this.employers[0]);
    }
  }

  addEmployersToYears() {
    for (const employer of this.employers) {
      for (const year of this.years) {
        if (employer.dateStart === year.year) {
          if (year.employers) {
            year.employers.push(employer);
          } else {
            year.employers = [employer];
          }
        }
      }
    }
    this.setSingleYearHeight();
  }

  setSingleYearHeight() {
    setTimeout(() => {
      const yearElems = this.elem.nativeElement.querySelectorAll('.year-container');
      this.singleYearHeight = yearElems[1].getBoundingClientRect().top - yearElems[0].getBoundingClientRect().top;
    });
  }

  setActiveEmployerContentHeight() {
    setTimeout(() => {
      const elem = this.elem.nativeElement.querySelector('.employer.active + .employer-details');
      this.activeEmployerContentHeight = elem.scrollHeight;
    });
  }

  fetchAdditionalEmployerData(employer: Employer) {
    const collRef = 'employment';
    const docRef = employer.firestoreKey.toString();

    // Handle Responsibilities
    this.dataHandler.getSubCollection(collRef, docRef, 'responsibilities')
      .then(response => {
        employer.responsibilities = [];

        for (const item of response) {
          employer.responsibilities.push(item.content);
        }
        if (!this.deviceDetector.isDesktop()) {
          this.setActiveEmployerContentHeight();
        }
      })
      .catch(error => console.log(error));

    // Handle Tools
    this.dataHandler.getSubCollection(collRef, docRef, 'tools' )
      .then(response => {
        employer.tools = [];

        for (const item of response) {
          employer.tools.push({ class: item.class, icon: this.icons[item.class] });
        }
        if (!this.deviceDetector.isDesktop()) {
          this.setActiveEmployerContentHeight();
        }
      })
      .catch(error => console.log(error));

    // Handle Languages
    this.dataHandler.getSubCollection(collRef, docRef, 'languages')
      .then(response => {
        employer.languages = [];

        for (const item of response) {
          employer.languages.push({ class: item.class, icon: this.icons[item.class] });
        }
        if (!this.deviceDetector.isDesktop()) {
          this.setActiveEmployerContentHeight();
        }
      })
      .catch(error => console.log(error));

    // Handle Projects
    this.dataHandler.getSubCollection(collRef, docRef, 'projects')
      .then(response => {
        employer.projects = [];

        for (const item of response) {
          const project = this.projectsService.getProject(item.id, 'db');
          employer.projects.push(project);
        }
      })
      .catch(error => console.log(error));
  }

  onSetActive(employer: Employer) {
    this.activeEmployer = employer;
    this.activeYear = null;

    if (this.deviceDetector.isDesktop()) {
      for (const year of this.years) {
        if (employer.dateStart === year.year) {
          this.activeYear = year;
        }
      }
    } else {
      this.setActiveEmployerContentHeight();
    }
    if (!employer.responsibilities) {
      this.fetchAdditionalEmployerData(employer);
    }
  }

  // Cleanup
  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

}
