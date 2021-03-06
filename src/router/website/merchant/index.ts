const Home = () =>
  import(
    /* webpackChunkName: "website-merchant" */ "@/view/website/merchant/Home.vue"
  );

const Merchant = () =>
  import(
    /* webpackChunkName: "website-merchant" */ "@/view/website/merchant/Merchant.vue"
  );

const Course = () =>
  import(
    /* webpackChunkName: "website-merchant" */ "@/view/website/merchant/Course.vue"
  );

const Article = () =>
  import(
    /* webpackChunkName: "website-merchant" */ "@/view/website/merchant/Article.vue"
  );

const Album = () =>
  import(
    /* webpackChunkName: "website-merchant" */ "@/view/website/merchant/Album.vue"
  );

const Teacher = () =>
  import(
    /* webpackChunkName: "website-merchant" */ "@/view/website/merchant/Teacher.vue"
  );

const Pending = () =>
  import(
    /* webpackChunkName: "website-merchant" */ "@/view/website/merchant/Pending.vue"
  );

import editingRoutes from "./editing";

const merchantRoutes: any = [
  {
    path: "merchants/:merchantId",
    component: Home,
    meta: {
      requireOpenid: true,
      requireAuth: true,
    },
    children: [
      {
        path: "",
        component: Merchant,
        name: "websiteMerchant",
        meta: { title: "机构门户" },
      },
      {
        path: "courses/:courseId",
        name: "websiteMerchantCourse",
        component: Course,
        meta: { title: "课程详情" },
      },
      {
        path: "albums/:albumId",
        name: "websiteMerchantAlbum",
        component: Album,
        meta: { title: "机构相册" },
      },
      {
        path: "articles/:articleId",
        name: "websiteMerchantArticle",
        component: Article,
        meta: { title: "最新动态", disableDefaultShare: true },
      },
      {
        path: "teachers/:teacherId",
        name: "websiteMerchantTeacher",
        component: Teacher,
        meta: { title: "师资简介" },
      },
      {
        path: "pending",
        name: "websiteMerchantPending",
        component: Pending,
        meta: { title: "申请开通门户服务" },
      },
    ].concat(editingRoutes),
  },
];

export default merchantRoutes;
