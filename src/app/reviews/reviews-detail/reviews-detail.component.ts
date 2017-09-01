import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Reviews, Applicant, Review, Reviewer, Userprofile, CurrentUser, Image, Achievement} from '../reviews';
import { ReviewsService } from '../reviews.service';

@Component({
  selector: 'app-reviews-detail',
  templateUrl: './reviews-detail.component.html',
  styleUrls: ['./reviews-detail.component.scss']
})

export class ReviewsDetailComponent implements OnInit {

  reviews : Reviews = new Reviews();
  applicant : Applicant = new Applicant();
  review : Review = new Review();
  reviewer : Reviewer = new Reviewer();
  userprofile : Userprofile = new Userprofile();
  currentUser : CurrentUser = new CurrentUser();
  image : Image = new Image();
  achievement : Achievement = new Achievement();


  constructor(
    private reviewsService: ReviewsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit():void {

    let id = this.route.snapshot.params['id'];
    this.reviewsService.getReviewsDetail(id).then(reviews => {
      this.reviews = reviews;
      this.applicant = reviews.applicant;
      this.review = reviews.applicant.review;
      this.reviewer = reviews.applicant.reviewer;
      this.userprofile = reviews.applicant.reviewer.userprofile;
      this.image = reviews.image;
      if(reviews.applicant.reviewer.userprofile.current_user == null) {
        this.currentUser = {
          follow: false
        };
      } else {
        this.currentUser = reviews.applicant.reviewer.userprofile.current_user;
      }

      let self = this;

      self.reviewsService.getAchievement(self.reviewer.id).then(achievement => {
        self.achievement = achievement;

        return self;
      });
    });

  }

  toProfile(id:number) {
    if(window['WebAppInterface']) {
      window['WebAppInterface'].toProfile(id);
    }
  }

  getScore(presentation:number = 0, cost_performance:number = 0, usability:number = 0) {
    return Math.round((presentation + cost_performance + usability) / 3 * 10) / 10;
  }

  getPosition(company:string, position:string) {
    if(company && position) {
      return `${position}  @  ${company}`;
    } else if(position && !company) {
      return `${position}`;
    } else if(company && !position) {
      return `${position}`;
    }
  }

  getPros(pros : any) {

    if(pros) {
      pros = pros.split('##');
    } else {
      pros = [];
    }

    return pros;
  }

  getCons(cons: any) {
    if(cons) {
      cons = cons.split('##');
    } else {
      cons = [];
    }
    return cons;
  }

}