import { VcPayload } from '../../src/credentials/vc-payload.class';
import { VerifiableCredentialAttribute } from '../../src/credentials/verifiable-credential-attribute.class';
import { JwtPayload } from '../../src/credentials/jwt-payload.class';
import { VpPayload } from '../../src/credentials/vp-payload.class';
import { VerifiablePresentationAttribute } from '../../src/credentials/verifiable-presentation-attribute.class';
import { _isNotEmpty, assertPayload } from './util-functions';

describe('test jwt payload serialization', () => {
    const issuer = "issuer_ontology_id";
    const verifiableAttributeId = "unique_subject_id";
    const credentialSubject = {
        "id": verifiableAttributeId,
        "isDriverLicenseValid": true
    };
    const verifiableCredentialAttribute = new VerifiableCredentialAttribute(
        ['DriverLicense'],
        issuer,
        credentialSubject
    );
    test('Should correctly go trough serialization process for verifiable credentials payload', () => {
        const vcPayload = new VcPayload(issuer, verifiableCredentialAttribute, Date.now(), verifiableAttributeId, new Date());

        const serialized = vcPayload.serialize();
        expect(_isNotEmpty(serialized)).toBeTruthy();

        const deserialized = JwtPayload.deserialize(serialized, VcPayload.payloadFromJson) as VcPayload;

        assertPayload(vcPayload, deserialized);
        expect(vcPayload.vc.issuer).toBe(deserialized.vc.issuer);
        expect(vcPayload.vc.type[0]).toBe(deserialized.vc.type[0]);
        expect(vcPayload.vc.type[1]).toBe(deserialized.vc.type[1]);
        expect(vcPayload.vc["@context"][0]).toBe(deserialized.vc["@context"][0]);
    });

    test('Should correctly go trough serialization process for verifiable presentation payload', () => {
     const verifiablePresentationAttribute = new VerifiablePresentationAttribute(["stringified_verifiable_credential"]);
     const vpPayload = new VpPayload(issuer, verifiablePresentationAttribute, Date.now(), "did:ont:audience", verifiableAttributeId, new Date());

     const serialized = vpPayload.serialize();
     expect(_isNotEmpty(serialized)).toBeTruthy();

     const deserialized = JwtPayload.deserialize(serialized, VpPayload.payloadFromJson) as VpPayload;

     assertPayload(vpPayload, deserialized);
     expect(vpPayload.vp.type[0]).toBe(deserialized.vp.type[0]);
     expect(vpPayload.vp.verifiableCredential[0]).toBe(deserialized.vp.verifiableCredential[0]);
     expect(vpPayload.vp["@context"][0]).toBe(deserialized.vp["@context"][0]);
    });
});

