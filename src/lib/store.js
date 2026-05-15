/**
 * QueueService - OOP Implementation for Firestore Data Store
 * Menerapkan prinsip Enkapsulasi, Abstraksi, dan Singleton.
 */

import { db } from './db';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  getCountFromServer,
} from 'firebase/firestore';

const QUEUES_COLLECTION = 'queues';
const FEEDBACKS_COLLECTION = 'feedbacks';

class QueueService {
  // ============ PRIVATE HELPERS (Encapsulation) ============
  
  _getTodayIso() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  }

  // ============ QUEUES (Abstraction) ============

  async getQueues() {
    const todayIso = this._getTodayIso();
    const snapshot = await getDocs(
      query(
        collection(db, QUEUES_COLLECTION),
        where('timestamp', '>=', todayIso),
        orderBy('timestamp', 'asc')
      )
    );
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async getQueueById(id) {
    const docRef = doc(db, QUEUES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  }

  async addQueue(ticket) {
    const { id, ...data } = ticket;
    const docRef = await addDoc(collection(db, QUEUES_COLLECTION), data);
    return { id: docRef.id, ...data };
  }

  async updateQueue(id, updates) {
    const docRef = doc(db, QUEUES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    await updateDoc(docRef, updates);
    return { id, ...docSnap.data(), ...updates };
  }

  async deleteQueue(id) {
    const docRef = doc(db, QUEUES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;
    await deleteDoc(docRef);
    return true;
  }

  async clearQueues() {
    const snapshot = await getDocs(collection(db, QUEUES_COLLECTION));
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }

  async getQueueCountByService(serviceCode) {
    const todayIso = this._getTodayIso();
    const q = query(
      collection(db, QUEUES_COLLECTION),
      where('serviceCode', '==', serviceCode),
      where('timestamp', '>=', todayIso)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  }

  async hasActiveTicket(phone) {
    const q = query(
      collection(db, QUEUES_COLLECTION),
      where('phone', '==', phone),
      where('status', 'in', ['waiting', 'called'])
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const d = snapshot.docs[0];
    return { id: d.id, ...d.data() };
  }

  async autoSkipExpired(timeoutMinutes = 3) {
    const todayIso = this._getTodayIso();
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const q = query(
      collection(db, QUEUES_COLLECTION),
      where('status', '==', 'called'),
      where('timestamp', '>=', todayIso)
    );
    const snapshot = await getDocs(q);
    let updated = false;

    const batch = writeBatch(db);
    snapshot.docs.forEach(d => {
      const data = d.data();
      if (data.calledAt) {
        const diff = Date.now() - new Date(data.calledAt).getTime();
        if (diff > timeoutMs) {
          batch.update(d.ref, { status: 'missed' });
          updated = true;
        }
      }
    });

    if (updated) await batch.commit();
    return updated;
  }

  // ============ FEEDBACKS ============

  async getFeedbacks() {
    const snapshot = await getDocs(
      query(collection(db, FEEDBACKS_COLLECTION), orderBy('timestamp', 'desc'))
    );
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async addFeedback(feedback) {
    const { id, ...data } = feedback;
    const docRef = await addDoc(collection(db, FEEDBACKS_COLLECTION), data);
    return { id: docRef.id, ...data };
  }

  async clearFeedbacks() {
    const snapshot = await getDocs(collection(db, FEEDBACKS_COLLECTION));
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }

  async deleteFeedback(id) {
    const docRef = doc(db, FEEDBACKS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return false;
    await deleteDoc(docRef);
    return true;
  }
}

// SINGLETON PATTERN
export const store = new QueueService();

