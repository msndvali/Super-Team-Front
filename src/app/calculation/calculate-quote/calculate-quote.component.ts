import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalculateService } from '../shared/services/calculation.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Guid } from 'guid-typescript';

/// THREE ///
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
/// THREE ///

@Component({
  selector: 'app-calculate-quote',
  templateUrl: './calculate-quote.component.html',
  styleUrls: ['./calculate-quote.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('0.7s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('0.2s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class CalculateQuoteComponent implements OnInit, AfterViewInit {
  calculateQuoteForm: FormGroup;
  private filesControl = new FormControl(null, FileUploadValidators.filesLimit(2));
  animation: boolean = true;
  multiple: boolean = false;

  public id: Guid;

  loadingSpinner: string = 'loading';
  deleteSpinner: string = 'delete';

  furnitures: any[] = [];

  states: any[] = [];
  cities: any[] = [];

  rooms: any = [
    { name: 'Bedroom', condition: 1, class: 'bedroom', id: 1, num: 1 },
    { name: 'Living Room', condition: 1, class: 'livingroom', id: 2, num: 1 },
    { name: 'Kitchen', condition: 1, class: 'kitchen', id: 3, num: 1 },
    { name: 'Bathroom', condition: 1, class: 'bathroom', id: 4, num: 1 }
  ];

  public roomsNum: any = {
    bedroom: 1,
    livingroom: 1,
    kitchen: 1,
    bathroom: 1
  }

  countBedroom: number = 0;
  countLivingRoom: number = 0;
  countKitchen: number = 0;
  countBathroom: number = 0;

  activeClass: string;
  conditionText: any = [];

  img = '';

  roomInfo = {
    1: ['▶ No construction or furniture installation needed at all.', '▶ Studios, 1 BR, Brokerage Plus, Fully furnished units'],
    2: ['▶ No construction work needs to be done, only furniture installation.', '▶ Shared homes'],
    3: ['▶ "June Homes Package" (Cosmetic work only)', '▶ If house (not apartment), becomes a category 3', '▶ If scope of work includes 4 points or more, becomes a category 3'],
    4: ['▶ All listed for Category 2', '▶ Structural work or additional vendors required', '▶ Any work needed for home/apartment to function properly']
  };

  isActive: boolean;
  isFirst: any;
  isDisplay: boolean = false;
  firstColor: number;

  positionX: any = -300;
  positionZ: any = -300;

  count: number = 4;

  public scene = new THREE.Scene();
  public raycaster = new THREE.Raycaster();
  public mouse = new THREE.Vector2();
  public renderer = new THREE.WebGLRenderer({ antialias: true });
  public camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight/2, 100, 5000 );
  public controls = new OrbitControls(this.camera, this.renderer.domElement);

  isHamburgerActive: boolean = false;

  sceneSize: any = 1.4;
  scrWidth: any;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrWidth = window.innerWidth;
    if(this.scrWidth < 1280) {
      this.sceneSize = 1;
    }
  }

  isJunehomes: boolean = false;
  junehomesAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

  constructor(
    private calculateService: CalculateService,
    private router: Router,
    private rend: Renderer2,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
    ) { }

  @ViewChild('canvas') canvas: ElementRef;

  ngOnInit() {
    this.getScreenSize();
    const token = localStorage.getItem('JwtToken');
    if (token) {
      const tokenInfo = this.getDecodedAccessToken(token);
      let role = tokenInfo.extension_Role;
      if(role == 'leader' || role == 'worker') {
        this.navigateToHome();
      }

      this.calculateService.checkJunehomes()
        .subscribe(res => {
          this.isJunehomes = res
          if(res == true) {
            this.rooms = [
              { name: 'Bedroom', condition: 3, class: 'bedroom', id: 1, num: 1 },
              { name: 'Living Room', condition: 3, class: 'livingroom', id: 2, num: 1 },
              { name: 'Kitchen', condition: 3, class: 'kitchen', id: 3, num: 1 },
              { name: 'Bathroom', condition: 3, class: 'bathroom', id: 4, num: 1 }
            ];
          } else {
            this.rooms = [
              { name: 'Bedroom', condition: 1, class: 'bedroom', id: 1, num: 1 },
              { name: 'Living Room', condition: 1, class: 'livingroom', id: 2, num: 1 },
              { name: 'Kitchen', condition: 1, class: 'kitchen', id: 3, num: 1 },
              { name: 'Bathroom', condition: 1, class: 'bathroom', id: 4, num: 1 }
            ];
          }
        });
    }
    this.spinner.show('loading');
    this.calculateQuoteForm = new FormGroup({
      totalArea: new FormControl(null, Validators.required),
      needsFurniture: new FormControl(false),
      files: this.filesControl,
      hasFloorPlan: new FormControl(false),
      address: new FormControl(null),
      cityId: new FormControl(null),
    });

    this.calculateService.getStates()
      .subscribe(states => {
        this.states = states.states;
      });

    this.loadObj('no');
    this.countRooms();
    this.getFurniture();
  }

  ngAfterViewInit() {
    this.rend.appendChild(this.canvas.nativeElement, this.renderer.domElement);

    let element: HTMLElement = document.getElementsByTagName("canvas")[0];
    element.addEventListener('click', () => {
      this.selectObject(event);
    });

    element.addEventListener("mousemove", ( e: any ) => {
      this.hoverObject(event);
    }, false);

    document.querySelectorAll("ng-select input").forEach(function(el) {
      el.setAttribute("autocomplete", "chrome-off")
    })
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  countRooms() {
    this.countBedroom = 0;
    this.countLivingRoom = 0;
    this.countKitchen = 0;
    this.countBathroom = 0;
    Object.values(this.rooms).forEach((count: any) => {
      if (count.class == 'bedroom') {
        this.countBedroom+=1;
      } else if (count.class == 'livingroom') {
        this.countLivingRoom++;
      } else if (count.class == 'kitchen') {
        this.countKitchen++;
      } else {
        this.countBathroom++;
      }
    });
  }

  first(index: any) {
    if(typeof index == 'string') {
      Object.values(this.rooms).forEach((element: any) => {
        if(element.id == +index) {
          this.activeClass = element.class;
          this.img = '../../../assets/photos/webp/'+element.class+'/'+element.class+element.condition+'.webp';
          this.conditionText = this.roomInfo[element.condition];
        }
      });
      this.isActive = true;
      this.isDisplay = true;
      this.isFirst = +index;
    } else {
      this.img = '../../../assets/photos/webp/'+this.activeClass+'/'+this.activeClass+index+'.webp';
      this.conditionText = this.roomInfo[index];
    }
  }

  junehomesChanged(rate: number, selectedRoom: any) {
    Object.values(this.rooms).forEach((room: any, index) => {
      if(selectedRoom.id == room.id) {
        room.condition = rate;
        this.img = '../../../assets/junhomes/webp/'+room.class+'/'+room.class+rate+'.webp';
      }
    });
  }

  getFurniture() {
    this.calculateService.getFurniture()
      .subscribe(data => {
        this.furnitures = data.furniture;
      });
  }

  openFurnitureModal(furniture: any) {
    this.modalService.open(furniture, { centered: true });
  }

  getColor(id): any {
    switch (id) {
      case 1:
        return '#a63c06';
      case 2:
        return '#c36f09';
      case 3:
        return '#a63c06';
      case 4:
        return '#710000';
    }
  }

  selectState(e: any) {
    let stateIds: any = [];
    stateIds.push(e.id);
    this.calculateService.getCities(stateIds)
      .subscribe(data => {
        this.cities = data.cities;
      });
  }

  onChangeFirst(event: string) {
    this.firstColor = +event;
  }

  back() {
    let reset: any;
    this.isActive = false;
    this.isFirst = reset;
    this.isDisplay = false;
    this.img = '';
    this.conditionText = [];
  }

  onSubmit() {
    if(!this.calculateQuoteForm.valid) {
      this.calculateQuoteForm.markAllAsTouched();
      return;
    }
    let roomTypes: any = {
      livingroom: 1,
      bedroom: 2,
      bathroom: 3,
      kitchen: 4
    };
    let roomTypesAndConditions: any = [];
    this.rooms.forEach(obj => {
      let roomId = roomTypes[obj.class];
      let condition = obj.condition;
      roomTypesAndConditions.push({ roomTypeId: roomId, conditionId: condition });
    });

    let floorPlanUrl: any = null;
    if(!this.calculateQuoteForm.value.files) {
      this.calculateService.passFloorPlan(floorPlanUrl);
    } else {
      this.id = Guid.create();
      floorPlanUrl = this.id.toString();
      const file = this.calculateQuoteForm.value.files[0];
      const formData = new FormData();
      formData.append('file', file, floorPlanUrl);

      this.calculateService.addFiles(formData)
        .subscribe(res => {});

      this.calculateService.passFloorPlan(floorPlanUrl);
      delete this.calculateQuoteForm.value.files;
    }
    delete this.calculateQuoteForm.value.files;

    const prop: {} = { roomTypesAndConditions };
    let rooms = Object.assign(this.calculateQuoteForm.value, prop);
    this.calculateService.passRoom(rooms);
    this.router.navigate(['/calculation/estimated-quote', { state: { id: '1' } }]);
  }

  newRoom(room: string) {
    this.loadObj(room);
  }

  loadObj(room: string) {

    if(room == 'no') {

      const loader = new OBJLoader();

      this.camera.position.x = 1000;
      this.camera.position.y = 1700;
      this.camera.position.z = 1000;

      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( window.innerWidth/this.sceneSize, window.innerHeight );
      this.renderer.setClearColor(0xf9f9f9, 1);

      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.RIGHT,
        MIDDLE: THREE.MOUSE.LEFT,
        RIGHT: THREE.MOUSE.LEFT
      }

      this.controls.enableZoom = false;

      var fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
      fillLight.position.set(100, 0, 100).normalize();

      var topLight = new THREE.DirectionalLight(0xffffff, 1);
      topLight.position.set(100, 100, -100).normalize();

      this.scene.add(fillLight);
      this.scene.add(topLight);


      var testLight = new THREE.DirectionalLight(0xffffff, 1);
      testLight.position.set(-100, 100, 100).normalize();
      this.scene.add(testLight);

      var animate = () => {
        requestAnimationFrame( animate );
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
      };

      animate();

      var mtlLoader = new MTLLoader();
        mtlLoader.setPath('../../../assets/new-rooms/bedroom/');
        mtlLoader.load('bedroom.mtl', (materials) => {
          loader.setMaterials(materials);
          materials.preload();
          loader.load(
            '../../../assets/new-rooms/bedroom/bedroom.obj',
            ( object: any ) => {
              object.name = "obj-" + 1;
              this.scene.add(object);

              var mtlLoader = new MTLLoader();
              mtlLoader.setPath('../../../assets/new-rooms/livingroom/');
              mtlLoader.load('livingroom.mtl', (materials) => {
                loader.setMaterials(materials);
                materials.preload();
                loader.load(
                  '../../../assets/new-rooms/livingroom/livingroom.obj',
                  ( object: any ) => {
                    object.position.z = this.positionZ;
                    object.name = "obj-" + 2;
                    this.scene.add(object);

                    var mtlLoader = new MTLLoader();
                    mtlLoader.setPath('../../../assets/new-rooms/kitchen/');
                    mtlLoader.load('kitchen.mtl', (materials) => {
                      loader.setMaterials(materials);
                      materials.preload();
                      loader.load(
                        '../../../assets/new-rooms/kitchen/kitchen.obj',
                        ( object: any ) => {
                          object.position.x = this.positionX;
                          object.name = "obj-" + 3;
                          this.scene.add(object);

                          var mtlLoader = new MTLLoader();
                          mtlLoader.setPath('../../../assets/new-rooms/bathroom/');
                          mtlLoader.load('bathroom.mtl', (materials) => {
                            loader.setMaterials(materials);
                            materials.preload();
                            loader.load(
                              '../../../assets/new-rooms/bathroom/bathroom.obj',
                              ( object: any ) => {
                                object.position.x = this.positionX;
                                object.position.z = this.positionZ;
                                object.name = "obj-" + 4;
                                this.scene.add(object);

                                this.spinner.hide('loading');
                              },
                              ( xhr: any ) => {
                                // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                              },
                              ( error: any ) => {
                                console.log( error );

                                this.spinner.hide('loading');
                              }
                            );
                          });
                        },
                        ( xhr: any ) => {
                          // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                        },
                        ( error: any ) => {
                          console.log( error );

                          this.spinner.hide('loading');
                        }
                      );
                    });
                  },
                  ( xhr: any ) => {
                    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                  },
                  ( error: any ) => {
                    console.log( error );

                    this.spinner.hide('loading');
                  }
                );
              });
            },
            ( xhr: any ) => {
              // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            ( error: any ) => {
              console.log( error );

              this.spinner.hide('loading');
            }
          );
      });


    } else {
      var roomName: string;
      if(room == 'bedroom') {
        roomName = 'Bedroom';
      } else if(room == 'bathroom') {
        roomName = 'Bathroom';
      } else if(room == 'kitchen') {
        roomName = 'Kitchen';
      } else {
        roomName = 'Living Room';
      }
      const loader = new OBJLoader();
      var mtlLoader = new MTLLoader();
      mtlLoader.setPath('../../../assets/new-rooms/'+room+'/');
      mtlLoader.load(room+'.mtl', (materials) => {
        loader.setMaterials(materials);
        materials.preload();
        loader.load(
          '../../../assets/new-rooms/'+room+'/'+room+'.obj',
          ( object: any ) => {
            if(this.count == 4) {
              this.positionX -= 300;
              object.position.x = this.positionX;
            }
            else if (this.count == 5) {
              object.position.x = this.positionX;
              object.position.z = this.positionZ;
            } else {
              if(this.count % 2 == 0) {
                this.positionX -= 300;
                object.position.x = this.positionX;
              } else {
                object.position.x = this.positionX;
                object.position.z = this.positionZ;
              }
            }
            this.count += 1;
            object.name = "obj-" + this.count;
            this.roomsNum[room] += 1;
            if(this.isJunehomes == true) {
              this.rooms.push({ name: roomName, condition: 3, class: room, id: this.count, num: this.roomsNum[room] });
            } else {
              this.rooms.push({ name: roomName, condition: 1, class: room, id: this.count, num: this.roomsNum[room] });
            }
            this.scene.add(object);
            this.countRooms();
          },
          ( xhr: any ) => {
            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          ( error: any ) => {
            console.log( error );
          }
        );
      });
    }
  }

  deleteRoom(roomId: number) {
    while(this.scene.children.length > 0){
      this.scene.remove(this.scene.children[0]);
    }
    Object.values(this.rooms).forEach((room: any, index) => {
      if(room.id == roomId) {
        this.rooms.splice(index, 1);
      }
    });

    this.back();

    this.renderAgain();
  }

  renderAgain() {
    this.spinner.show('delete');
    this.positionX = 0;
    this.positionZ = -300;

    let arrlen: number = this.rooms.length;

    var fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(100, 0, 100).normalize();

    var topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(100, 100, -100).normalize();

    this.scene.add(fillLight);
    this.scene.add(topLight);

    let count = 0;
    this.rooms.forEach((room, index) => {
      const loader = new OBJLoader();
      var mtlLoader = new MTLLoader();
      mtlLoader.setPath('../../../assets/new-rooms/'+room.class+'/');
      mtlLoader.load(room.class+'.mtl', (materials) => {
        loader.setMaterials(materials);
        materials.preload();
        loader.load(
          '../../../assets/new-rooms/'+room.class+'/'+room.class+'.obj',
          ( object: any ) => {
            object.name = "obj-"+room.id;
            if(count == 0) {
              object.position.x = this.positionX;
              count +=1;
            } else {
              if(count % 2 == 0) {
                object.position.x = this.positionX;
                count += 1;
              } else {
                object.position.z = this.positionZ;
                object.position.x = this.positionX;
                count += 1;
                if(count != arrlen) {
                  this.positionX -= 300;
                }
              }
            }
            this.count = count;
            this.scene.add(object);
            if(count == arrlen) {
              this.spinner.hide('delete');
              this.countRooms();
            }
          },
          ( xhr: any ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          },
          ( error: any ) => {
            console.log( error );

            this.spinner.hide('delete');
          }
        );
      });
    });
  }

  selectObject(e: any) {
    e.preventDefault();
    try {
      var mouseX = (((e.clientX  / window.innerWidth*this.sceneSize) * 2) - 1);
      var mouseY = (((e.clientY  / window.innerHeight) * -2) + 1);
      var vector = new THREE.Vector3( mouseX, mouseY, 0.5 );
      vector.unproject(this.camera);
      var raycaster = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
      var intersects = raycaster.intersectObjects( this.scene.children, true );
      var selectedObject: any = intersects[0].object.parent?.name;

      // ALERT ID
      var selectedId = selectedObject.substring(selectedObject.indexOf('-') + 1);
      this.first(selectedId);
    } catch {
      return;
    }
  }

  hoverObject(e: any) {
    e.preventDefault();
    const smoothness = 0.5;
    try {
      var mouseX = (((e.clientX  / window.innerWidth*this.sceneSize) * 2) - 1);
      var mouseY = (((e.clientY  / window.innerHeight) * -2) + 1);
      var vector = new THREE.Vector3( mouseX, mouseY, 1 ), INTERSECTED;
      vector.unproject(this.camera);
      var raycaster = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
      var intersects = raycaster.intersectObjects( this.scene.children, true );
      var selectedObject: any = intersects[0].object.parent?.name;

      if ( selectedObject ) {
        var objectName: any;
        INTERSECTED = intersects[ 0 ].object.parent;

        var selected = this.scene.children;
        for (let obj = 2; obj < selected.length; obj++) {
          if (selected[obj].name != INTERSECTED.name) {
            const selectedPosition = selected[obj].position.clone();
            selectedPosition.y = 0;
            selected[obj].position.lerp(selectedPosition, smoothness);
          }
        }

        objectName = INTERSECTED.name;

        const targetPosition = INTERSECTED.position.clone();
        targetPosition.y = 25;
        INTERSECTED.position.lerp(targetPosition, smoothness);

      }
    } catch {
      var selected = this.scene.children;
      for (let obj = 2; obj < selected.length; obj++) {
        if (selected[obj].position.y > 0) {
          const selectedPosition = selected[obj].position.clone();
          selectedPosition.y = 0;
          selected[obj].position.lerp(selectedPosition, smoothness);
        }
      }
    }
  }

  hamburgerActive() {
    this.isHamburgerActive = !this.isHamburgerActive;
  }

  ngOnDestroy(): void {
    this.renderer.forceContextLoss();
  }
}
