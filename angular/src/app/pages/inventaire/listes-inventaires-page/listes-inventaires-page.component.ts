import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  
  InventaireService,
} from "src/app/services/inventaire/inventaire.service";
import { NotificationService } from "src/app/services/notification/notification.service";
declare var bootstrap: any;

@Component({
  selector: "app-listes-inventaires-page",
  templateUrl: "./listes-inventaires-page.component.html",
  styleUrls: ["./listes-inventaires-page.component.scss"],
})
export class ListesInventairesPageComponent implements OnInit, AfterViewInit{
  inventaires;
  loading = false;
  error = "";
  selectedInventaireId: number | null = null;

  @ViewChild("updateModal") updateModal!: TemplateRef<any>;
  @ViewChild("createModal") createModal!: TemplateRef<any>;

  createInventaireForm!: FormGroup;
  selectedInventaireForm!: FormGroup;
  currentInventaire;

  constructor(
    private inventaireService: InventaireService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private notif: NotificationService
  ) {}
  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
  }

  ngOnInit(): void {
    this.loadInventaires();
    this.initCreateForm();
  }

  initCreateForm() {
    this.createInventaireForm = this.fb.group({
      datedebut: [""],
      datefin: [""],
      status: [""],
    });
  }
  // Charger tous les inventaires
  loadInventaires() {
    this.loading = true;
    this.inventaireService.getInventaires().subscribe({
      next: (data) => {      
        this.inventaires = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = "Erreur lors du chargement des inventaires";
        this.loading = false;
      },
    });
  }

  // Sélection d'un inventaire
  selectInventaire(id) {
    this.selectedInventaireId = id;
  }

  // Supprimer un inventaire
  deleteInventaire(inv) {
    if (!confirm(`Voulez-vous supprimer l'inventaire ${inv.idinventaire} ?`))
      return;

    this.inventaireService.deleteInventaire(inv.idinventaire).subscribe({
      next: () => {
        this.inventaires = this.inventaires.filter(
          (i) => i.idinventaire !== inv.idinventaire
        );
        if (this.selectedInventaireId === inv.idinventaire) {
          this.selectedInventaireId = null;
        }
        this.notif.success(
          `Inventaire ${inv.idinventaire} supprimé avec succès`
        );
      },
      error: () =>
        this.notif.error("Erreur lors de la suppression de l'inventaire"),
    });
  }

  // Ouvrir modal update
  updateInventaire(inv) {
    this.currentInventaire = inv;

    this.selectedInventaireForm = this.fb.group({
      datedebut: [this.formatDateToInput(inv.datedebut)],
      datefin: [this.formatDateToInput(inv.datefin)],
      status: [inv.status],
    });

    const modalRef = this.modalService.open(this.updateModal, {centered: true});
    modalRef.result.then(
      (result) => {
        if (result === "save") {
          this.saveUpdate();
        }
      },
      () => {} 
    );
  }

  // Formater la date en YYYY-MM-DD pour input type="date"
  formatDateToInput(date) {
    if (!date) return "";
    const d = new Date(date);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  // Sauvegarder update
  saveUpdate() {
    const updatedData = this.selectedInventaireForm.value;

    this.inventaireService
      .updateInventaire(this.currentInventaire.idinventaire, updatedData)
      .subscribe({
        next: (updated) => {
          const index = this.inventaires.findIndex(
            (i) => i.idinventaire === this.currentInventaire.idinventaire
          );
          if (index > -1) {
            this.inventaires[index] = {
              ...this.inventaires[index],
              ...updated,
            };
          }
          this.currentInventaire = { ...this.currentInventaire, ...updated };
          this.notif.success("Inventaire mis à jour avec succès"); 
        },
        error: () => this.notif.error("Erreur lors de la mise à jour"),
      });
  }

  openCreateModal() {
    this.createInventaireForm = this.fb.group({
      datedebut: [""],
      datefin: [""],
      status: [""],
    });

    const modalRef = this.modalService.open(this.createModal, {
      centered: true,
    });
    modalRef.result.then(
      (result) => {
        if (result === "save") {
          this.saveCreate();
        }
      },
      () => {} 
    );
  }

  saveCreate() {   
    if (this.createInventaireForm.invalid) return;
    const newData = this.createInventaireForm.value;

    this.inventaireService.createInventaire(newData).subscribe({
      next: (created) => {
        this.inventaires.unshift(created);
        this.createInventaireForm.reset();
        this.loadInventaires();

        this.notif.success("Inventaire créé avec succès");

      },
      error: () => this.notif.error("Erreur lors de la création"),
    });
  }
}
